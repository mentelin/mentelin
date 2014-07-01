'use strict';

angular.module('mentelinApp')
  .controller('MainCtrl', function ($scope, $http, $upload) {
    var Book;

    $http.get('/api/books')
      .success(function (data) {
        $scope.books = data;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });

    $http.get('/api/upload')
      .success(function (data) {
        $scope.files = data;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });

    $scope.uploadFile = function ($files) {
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];

        $scope.upload = $upload.upload({
            url: '/api/upload',
            file: file
          })
          .progress(function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
          })
          .success(function (data, status, headers, config) {
            $http.get('/api/upload')
              .success(function (data) {
                $scope.files = data;
              })
              .error(function (data) {
                console.log('Error: ' + data);
              });
          });
      }
    };

    $scope.deleteFile = function (file) {
      $http.delete('/books/' + file)
        .success(function (data) {
          $scope.message = data;

          $http.get('/api/upload')
            .success(function (data) {
              $scope.files = data;
            })
            .error(function (data) {
              console.log('Error: ' + data);
            });
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    $scope.createBook = function () {
      $http.post('/api/books', $scope.book)
        .success (function (data) {
          $scope.book = {};
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    // $scope.readBook = function (book) {
    //   Book = ePub(book.file);

    //   $('#readerContent').html('');

    //   Book.renderTo("readerContent");

    //   $('#modalReaderLabel').append(book.name);

    //   $('#modalReader').modal('toggle');
    // };

    // $scope.prevPage = function () {
    //   Book.prevPage();
    // };

    // $scope.nextPage = function () {
    //   Book.nextPage();
    // };

    $scope.updateBook = function (id) {
      var books = angular.fromJson($scope.books),
          book;

      for (var i = 0; books.length > i; i++) {
        if (books[i]._id === id) {
          book = books[i];
        }
      }

      $http.put('/api/books/' + id, book)
        .success(function (data) {
          $scope.book = {};
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };

    $scope.deleteBook = function (id) {
      $http.delete('/api/books/' + id)
        .success(function (data) {
          $scope.books = data;
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });
    };
  });
