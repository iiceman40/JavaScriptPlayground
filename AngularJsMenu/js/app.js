var app = angular.module('tutorialApp', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {templateUrl: 'templates/page/articles.html'})
		.when('/about', {template: 'Über unsere Pizzeria'})
		.otherwise({redirectTo: '/'});
});

app.controller('ArticlesCtrl', function ($scope, $http, Cart) {
	$scope.cart = Cart;
	$scope.search = 'test';

	$http.get('data/articles.json').then(function (articlesResponse) {
		$scope.articles = articlesResponse.data;
	});

	$scope.test = function(){
		console.log($scope.search);
	}
});

app.controller('CartCtrl', function ($scope, Cart) {
	$scope.cart = Cart;
});

app.factory('Cart', function () {
	var items = [];
	return {
		getItems: function () {
			return items;
		},
		addArticle: function (article) {
			items.push(article);
		},
		removeArticle: function (index) {
			items.splice(index, 1);
		},
		sum: function () {
			return items.reduce(function (total, article) {
				return total + article.price;
			}, 0);
		}
	};
});

app.directive('price', function () {
	return {
		restrict: 'E',
		scope: {
			value: '='
		},
		templateUrl: 'templates/partials/price.tpl.html'
	}
});