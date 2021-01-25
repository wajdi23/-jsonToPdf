Voici les étapes à suivre pour tester la solution de conversion en masse de JSON en PDF des CVs

    1. Installer NodeJS (v12 ou +) du site https://nodejs.org/en/

    2. Installer le package HackMyResume en global sur votre machine :
	 	npm install hackmyresume –g
    3. Installer l’outil wkhtmltopdf  https://wkhtmltopdf.org/downloads.html
		et ajouter une variable d’environnement : (exemple)
		C:/Program Files/wkhtmltopdf/bin

    4. Aller au repo racine du projet & :  npm install

    5. Exécuter npm start

    6. Placer les JSONs sous le dossier input/, les pdfs générés seront sous le dossier output/

Il y a un fichier report.xls sous le dossier racine de l’application, qui va permettre de visualiser quelques logs 


