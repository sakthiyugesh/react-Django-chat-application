# views.py

import requests
import requests_oauthlib
from rest_framework import status, generics, permissions
from django.db.models import OuterRef,Subquery,Q
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import *
from backend import settings
from django.shortcuts import redirect
from django.contrib.auth import authenticate
from django.http import JsonResponse


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

@api_view(['get'])
def Userget(APIView):
    user = CustomUser.objects.all()
    serializer = UserSerializer(user,many=True)
    return Response(serializer.data)


class ListMessageView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):

        messages = ChatMessage.objects.all()
        serializer = self.serializer_class(messages, many=True)
        # return Response(serializer.data)
        return messages

class ChatInbox(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        # Get the last message IDs for the user with their contacts
        last_message_ids = CustomUser.objects.filter(
            Q(sender__receiver=user_id) | Q(receiver__sender=user_id)  # Use OR for clarity
        ).distinct().annotate(
            last_msg=Subquery(
                ChatMessage.objects.filter(
                    Q(sender=OuterRef('id'), receiver=user_id) |
                    Q(receiver=OuterRef('id'), sender=user_id)  # Use OR for clarity
                ).order_by("-id")[:1].values_list('id', flat=True)
            )
        ).values_list("last_msg", flat=True)

        # Filter messages based on the last message IDs
        messages = ChatMessage.objects.filter(id__in=last_message_ids).order_by('id')
        return messages
    

class GetMessage(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        message = ChatMessage.objects.filter(
            sender__in =[sender_id,receiver_id],
            receiver__in =[sender_id ,receiver_id]
        ).order_by('id')
        return message
    
@api_view(['POST'])
def set_read_messages(request, *args, **kwargs):
    # Extract message IDs from the request body
    msg_ids = request.data.get('msg_ids', [])
    
    if not msg_ids:
        return Response({"error": "No message IDs provided."}, status=400)

    # Update the `is_read` field for the specified messages
    updated_count = ChatMessage.objects.filter(id__in=msg_ids).update(is_read=True)
    
    return Response({"success": True, "updated_count": updated_count, "message": "Messages marked as read."}) 

    
class SendMessage(generics.CreateAPIView):
    serializer_class = MessageSerializer




class GoogleLogin(APIView):
    def post(self, request):
        token = request.data.get('token')
        response = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers={
            "Authorization": f"Bearer {token}"
        })
        user_info = response.json()

        if 'email' not in user_info:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        email = user_info['email']
        # username = email.split('@')[0]
        user, created = CustomUser.objects.get_or_create(email=email, defaults={
            'username': email.split('@')[0],
            'first_name': user_info.get('given_name', ''),
            'last_name': user_info.get('family_name', ''),
        })
        # user.password = SetPasswordForm
        if created:
           
            user.set_unusable_password()  
            # user.username = 
            user.save()

        refresh = RefreshToken.for_user(user)
        access_token = RefreshToken.for_user(user).access_token
        access_token['user_id'] = user.id
        access_token['email'] = user.email
        access_token['first_name'] = user.first_name
        access_token['last_name'] = user.last_name
        
        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
        })
    



# Create your views here.

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    def post(self,request):
        user=request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        return Response(user_data, status=status.HTTP_201_CREATED)
    



class LoginView(APIView):
    serializer_class = LoginSerializer
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # Authenticate user
        user = authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        if not user.is_active:
            raise AuthenticationFailed('Account disabled, contact admin')

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token['user_id'] = user.id
        access_token['email'] = user.email
        access_token['first_name'] = user.first_name
        access_token['last_name'] = user.last_name

        return Response(
            {
                'refresh': str(refresh),
                'access': str(access_token),
            },
            status=status.HTTP_200_OK
        )


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



    

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

