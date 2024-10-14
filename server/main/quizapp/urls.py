from django.urls import path 
from .views import logout_view, get_questions, get_user_details, get_topics, get_topics_id
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns =[
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='token_logout'),
    path('get_questions/', get_questions, name='get_questions'),
    path('get_user_details/', get_user_details ,name='get_user_details'),
    path('get_topics/', get_topics, name='get_topics'),
    path('get_topics_id/<int:id>/', get_topics_id, name='get topics by id')
]