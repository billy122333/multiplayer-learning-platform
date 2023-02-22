
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from forum import views
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'forum', views.ForumView, 'forum')
router.register(r'thread', views.ThreadView, 'thread')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/forum/', include(router.urls)),
    path('api/', include('api.urls')),
    path('auth/', include('accounts.urls')),
    path('whiteboard/', include('whiteboard.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # change