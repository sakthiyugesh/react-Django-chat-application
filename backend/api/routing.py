from django.urls import re_path, path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<sender_id>\d+)/(?P<receiver_id>\d+)/$", consumers.ChatConsumer.as_asgi()),
    re_path(r"ws/chat/inbox/(?P<user_id>\d+)/$", consumers.InboxConsumer.as_asgi()),
    
]
