from rest_framework import viewsets
from raterapi.models import PlayerReview
from rest_framework import serializers


class PlayerReviewSerializer(serializers.ModelSerializer): 
    class Meta:
        model = PlayerReview
        fields = ('id', 'player', 'game', 'review')
        read_only_fields = ('player',) 


class PlayerReviewView(viewsets.ModelViewSet):
    queryset = PlayerReview.objects.all()
    serializer_class = PlayerReviewSerializer

    def perform_create(self, serializer):
        # Automatically assign the logged-in player to the review
        serializer.save(player=self.request.user)

    def get_queryset(self):
        game_id = self.request.query_params.get('game')
        if game_id:
            return self.queryset.filter(game_id=game_id)
        return self.queryset