from django.shortcuts import render
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data["refresh_token"]
        print(f"Received refresh token: {refresh_token}") 
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the refresh token

        return Response(status=status.HTTP_205_RESET_CONTENT)  # Return 205 Reset Content
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)  # Handle errors

