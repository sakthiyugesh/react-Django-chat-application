# urls.py

from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

 
urlpatterns = [
    path('message-list/',ListMessageView.as_view()),
    path('user/',Userget),
    path('my-message/<user_id>/',ChatInbox.as_view()),
    path('send-message/',SendMessage.as_view()),
    # path('profile/',ProfileView.as_view()),
    path('all-message/<sender_id>/<receiver_id>/',GetMessage.as_view()),
    path('read-messages/',set_read_messages),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),

    path('register/',RegisterView.as_view(),name="register"),
    path('login/',LoginView.as_view(),name="login"),
    path('logout/', LogoutAPIView.as_view(), name="logout"),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
] 