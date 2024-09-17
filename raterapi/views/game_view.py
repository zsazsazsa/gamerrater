from django.http import HttpResponseServerError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from raterapi.models import Game, Category

class GameView(ViewSet): 
    def list(self, request):
    # Get query string parameter
        owner_only = self.request.query_params.get("owner", None)

        try:
            # Start with all rows
            games = Game.objects.all()

            # If `?owner=current` is in the URL
            if owner_only is not None and owner_only == "current":
                # Filter to only the current user's rocks
                games = games.filter(user=request.auth.user)

            serializer = GameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as ex:
            return HttpResponseServerError(ex)
        
    def retrieve(self, request, pk=None):
        try:
            book = Game.objects.get(pk=pk)
            serializer = GameSerializer(book, context={'request': request})
            return Response(serializer.data)

        except Game.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """Handle POST requests for creating a new game"""
        game = Game()
        game.title = request.data['title']
        game.description = request.data['description']
        game.designer = request.data['designer']
        game.year_released = request.data['year_released']
        game.number_of_players = request.data['number_of_players']
        game.estimated_time = request.data['estimated_time']
        game.age_recommendation = request.data['age_recommendation']
        game.save()

        # Handle the many-to-many categories
        for category_id in request.data['categories']:
            category = Category.objects.get(id=category_id)
            game.categories.add(category)

        game.save()
        serialized = GameSerializer(game, many=False)

        return Response(serialized.data, status=status.HTTP_201_CREATED)


        
class GameCategorySerializer(serializers.ModelSerializer):
    """JSON serializer"""

    class Meta:
        model = Category
        fields = ( 'title', )
        
class GameSerializer(serializers.ModelSerializer): 

    categories = GameCategorySerializer(many=True)

    class Meta:
        model = Game
        fields = ( 'id', 'title', 'description', 'designer', 'year_released', 'number_of_players', 'estimated_time', 'age_recommendation', 'categories' )
        