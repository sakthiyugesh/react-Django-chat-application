import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage, CustomUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        self.room_name = f"chat_{min(self.sender_id, self.receiver_id)}_{max(self.sender_id, self.receiver_id)}"
        self.room_group_name = f"chat_{self.room_name}"

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender_id = data['sender']
        receiver_id = data['receiver']
        message = data['message']

        # Save the message to the database
        sender = await sync_to_async(CustomUser.objects.get)(id=sender_id)
        receiver = await sync_to_async(CustomUser.objects.get)(id=receiver_id)
        chat_message = ChatMessage(
            sender=sender, receiver=receiver, message=message
        )
        await sync_to_async(chat_message.save)()

        # unread_count = await sync_to_async(ChatMessage.get_unread_count)(sender=sender, receiver=receiver)
        receiver_unread_count = await sync_to_async(ChatMessage.get_unread_count)(
        sender=sender, receiver=receiver
        )

        # Prepare message structure
        message_data = {
            "id": chat_message.id,
            "sender_profile": {
                "email": sender.email,
                "bio": sender.bio,
                "username": sender.username,
                "id": sender.id,
            },
            "receiver_profile": {
                "email": receiver.email,
                "bio": receiver.bio,
                "username": receiver.username,
                "id": receiver.id,
            },
            "message": chat_message.message,
            "is_read": chat_message.is_read,
            "date_time": chat_message.date_time.isoformat(),
            "sender": sender.id,
            "receiver": receiver.id,
            "unread_count":receiver_unread_count
        }

        # Send message to the chat room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_data,
            }
        )

        # Notify the sender's and receiver's inbox groups
        await self.channel_layer.group_send(
            f'inbox_{sender_id}',
            {
                'type': 'inbox_update',
                'message': message_data,
            }
        )

        await self.channel_layer.group_send(
            f'inbox_{receiver_id}',
            {
                'type': 'inbox_update',
                'message': message_data,
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps(event['message']))


class InboxConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the user ID from the URL route
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.inbox_group_name = f'inbox_{self.user_id}'

        # Add user to their inbox group
        await self.channel_layer.group_add(
            self.inbox_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from the inbox group
        await self.channel_layer.group_discard(
            self.inbox_group_name,
            self.channel_name
        )

    async def inbox_update(self, event):
        message = event['message']

        # Send the inbox update to the WebSocket client
        await self.send(text_data=json.dumps(message))
