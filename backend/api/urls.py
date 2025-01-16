# urls.py

from django.urls import path
from .views import *
 
urlpatterns = [
    path('message-list/',ListMessageView.as_view()),
    path('user/',Userget),
    path('my-message/<user_id>/',ChatInbox.as_view()),
    path('send-message/',SendMessage.as_view()),
    # path('profile/',ProfileView.as_view()),
    path('all-message/<sender_id>/<receiver_id>/',GetMessage.as_view()),
    path('read-messages/',set_read_messages),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
] 