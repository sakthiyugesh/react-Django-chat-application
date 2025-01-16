# serializers.py

from rest_framework import serializers
from .models import *

# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['username', 'email', 'password']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = CustomUser(**validated_data)
#         user.set_password(validated_data['password'])
#         user.save()
#         return user 
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email','bio','username', 'id']
        
class MessageSerializer(serializers.ModelSerializer):
    sender_profile = ProfileSerializer(source="sender",read_only= True)
    receiver_profile = ProfileSerializer(source="receiver", read_only= True)
    unread_count = serializers.SerializerMethodField()
    class Meta: 
        model = ChatMessage 
        fields = '__all__'

    def get_unread_count(self, obj):
        # Calculate unread messages for a conversation (example logic)
        return ChatMessage.objects.filter(
            sender=obj.sender,
            receiver=obj.receiver,
            is_read=False
        ).count()


