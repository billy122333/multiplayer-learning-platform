from django.conf import settings
from twilio.jwt.access_token import AccessToken, grants
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Dial

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
# Create your views here.
from twilio.rest import Client

from .serializers import TokenSerializer

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


@method_decorator(csrf_exempt, name="dispatch")
class RoomView(View):
    def get(self, request, *args, **kwargs):
        rooms = client.conferences.stream(
            status="in-progress"
        )
        rooms_reps = []
        rooms_reps = [
            {
                "room_name": conference.friendly_name,
                "sid": conference.sid,
                "participants": [
                    p.label for p in conference.participants.list()
                ],
                "status": conference.status,
            } for conference in rooms]
        return JsonResponse({"rooms": rooms_reps})

    def post(self, request, *args, **kwargs):
        room_name = request.POST["roomName"]
        participant_label = request.POST["participantLabel"]
        response = VoiceResponse()
        dial = Dial()
        dial.conference(
            name=room_name,
            participant_label=participant_label,
            start_conference_on_enter=True,
        )
        response.append(dial)

        # Twillo request xml type
        return HttpResponse(response.to_xml(), content_type="text/xml")


# class TokenView(View):
#     def get(self, request, username, *args, **kwargs):
#         voice_grant = grants.VoiceGrant(
#             outgoing_application_sid=settings.TWIML_APPLICATION_SID,
#             incoming_allow=True,
#         )
#         access_token = AccessToken(
#             settings.TWILIO_ACCOUNT_SID,
#             settings.TWILIO_API_KEY,
#             settings.TWILIO_API_SECRET,
#             identity=username
#         )

#         access_token.add_grant(voice_grant)
#         jwt_token = access_token.to_jwt()
#         # take away decode
#         return JsonResponse({"token": jwt_token.encode().decode("utf-8")})

class TokenView(generics.GenericAPIView):

    permission_classes = (AllowAny,)
    serializer_class = TokenSerializer

    def post(self, request):
        json = request.data
        serializer = TokenSerializer(data=json)
        serializer.is_valid(raise_exception=True)

        response = {
            'token': serializer.save(),
            'message': 'welcome to the room',
        }

        return Response(data=response, status=status.HTTP_200_OK)
