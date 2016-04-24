var db = null;

var toDoApp = angular.module('starter', ['ionic']);

//standart run function
toDoApp.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

//controller ToDoListCtrls
toDoApp.controller('ToDoListCtrl', function ($scope, filterFilter, $ionicPopup, $ionicModal, $http) {

    $scope.tasks = [];
    $http.get('js/statuses.json').then(function (res) {
        $scope.statuses = res.data || [];
    });

    //Init function
    $scope.init = function () {
        $scope.getAllTasks();
    };



    //CRUD operation with Tasks
    $scope.addTask = function (task) {

        if (!task || !task.title || !task.status) {
            $ionicPopup.alert({
                title: 'Error'
                , template: 'Title or/and status is empty!'
            });
            return;
        }

        $scope.tasks.push({
            title: task.title
            , created: new Date()
            , status: task.status
            , id: guid()
        });
        $scope.updateTasks();
    }

    $scope.deleteTask = function (idx) {
        $scope.tasks = filterFilter($scope.tasks, {
            id: '!' + idx
        })
        $scope.updateTasks();
    };

    $scope.updateStatus = function (taskid, status) {
        for (var i in $scope.tasks) {
            if ($scope.tasks[i].id == taskid) {
                $scope.tasks[i].status = status;
                switch (status) {
                case "Pending":
                    $scope.tasks[i].pendingStatusAt = new Date();
                    break;
                case "Done":
                    $scope.tasks[i].doneStatusAt = new Date();
                    break;
                }
                break;
            }
        }
        $scope.updateTasks();
    }

    $scope.filterTaskByStatus = function (status) {
        return filterFilter($scope.tasks, {
            status: status
        })
    }

    $scope.updateTasks = function () {
        localStorage['tasks'] = JSON.stringify($scope.tasks);
    }

    $scope.getAllTasks = function () {
            $scope.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        }
        //CRUD operation with Tasks


    // Modal for create Task
    $ionicModal.fromTemplateUrl('new-task-modal.html', {
        scope: $scope
        , animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.taskModal = modal;
    });
    $scope.openNewTaskWindow = function () {
        $scope.taskModal.show();
    };
    $scope.addNewTaskWindow = function (task) {
        $scope.addTask(task);
        $scope.closeNewTaskWindow();
    };
    $scope.closeNewTaskWindow = function () {
        $scope.taskModal.hide();
    }


    //Service function for generate GUID
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
});