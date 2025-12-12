from rest_framework.routers import DefaultRouter
from trips.views import TripViewSet

router = DefaultRouter()
router.register('trips', TripViewSet)

urlpatterns = router.urls
