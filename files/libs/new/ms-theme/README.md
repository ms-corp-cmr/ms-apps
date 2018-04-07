
	########## Requirements ########## 

	- Angular js


	##########  Composition ########## 

	* CSS
		1- Ajout de swiper.min.css
		2- Ajout des styles persos


	* JS
		1- Ajout de swiper.min.js
		2- Déclaration de l'objet qui sera utilisé par tout les autres : var msTheme
		3- Déclaration des modules : msPage avec gestion des boutons de navigation du browser




	NB : à inclure avant tout contenu désirant l'utiliser, par exemple dans notre cas d'espèce, à inclure avant app.js car lle fichier ms-theme.js contient des variables globales comme : msTheme


	########## Gestion des pages ###########

	**** Ajouter une page ****

		Exemple : Ajout de welcome page

			renderPage(id){
                if(msTheme.renderPage(id))
                /* Welcome template */ angular.element(document.getElementById(id)).append($compile('<ms-page class="ms-page" titre="'+id+'" url="templates/'+id+'/index'+'-'+welcome.device.type+'.html"></ms-page>')($scope));
            
            },
            addTemplate : function(){
                this.renderPage(welcome.templates.welcome);
            }


     ########## Modules ###########

     	* Background Page loader
     		Permet de pécifier que le contenu d'un conteneur est en cours de chargement, ceci à travers don background qui deviendra animé.

     		Utilisation :
     			Il suffit d'ajouter la classe suivante à l'élément souhaité: 
     				a- " ms-animated-background " pour un background couvrant la totalité de l'objet
     				b- " ms-animated-background barre "  pour ajouter une barre avec un background animé


