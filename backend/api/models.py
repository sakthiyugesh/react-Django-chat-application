# models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True) 
    bio = models.CharField(max_length=255, blank=True)
    cover_photo = models.ImageField(upload_to='covers/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
class ChatMessage(models.Model):
    message = models.CharField(max_length=1000,null=False, blank=False)
    # user = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='user')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='receiver')
    is_read = models.BooleanField(default=False)
    date_time= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.email}- {self.receiver.email}"
    
    @staticmethod
    def get_unread_count(sender, receiver):
        return ChatMessage.objects.filter(sender=sender, receiver=receiver, is_read=False).count()
    
    @property
    def sender_profile(self):
        user = CustomUser.objects.get(email = self.sender.email)
    @property
    def receiver_profile(self):
        user = CustomUser.objects.get(email = self.receiver.email)
    