# serializers.py

from rest_framework import serializers
from .models import *
from django.contrib import auth


from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

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






class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password']
    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')
        if not username.isalnum():
            raise serializers.ValidationError(
                self.default_error_messages)
        return attrs
    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate

class LoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'tokens']


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs
    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # These are claims, you can add custom claims
        # token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        # token['bio'] = user.profile.bio
        # token['image'] = str(user.profile.image)
        # token['verified'] = user.profile.verified
        # ...
        return token
