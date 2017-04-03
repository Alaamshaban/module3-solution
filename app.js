(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenusearchService', MenusearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems',foundItems);

  function foundItems(){
    var ddo={
      templateUrl:'foundItems.html'
    };
    return ddo;
  }

  MenusearchService.$inject = ['$http', 'ApiBasePath'];
  function MenusearchService($http,ApiBasePath){
    var service = this;
    var foundItems=[];



    service.getMatchedMenuItems = function (searchTerm) {
      foundItems = [];

      service.error=function(searchTerm){
        if(searchTerm.trim() == ""){
          return service.error="Nothing found";
        }
      }
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {

        //process result and only keep items that match
        service.show=function(){
          for(var i=0;i<result.data.menu_items.length;i++){
            if(result.data.menu_items[i].description.toLowerCase().indexOf(searchTerm)!==-1 && result.data.menu_items[i].description.indexOf(searchTerm)!=""){
              foundItems.push(result.data.menu_items[i]);
            }
          }
          return foundItems;
        };
          service.error=function(foundItems){
             if(foundItems.length==0){
                 return service.error="Nothing found";}
          }
        service.remove=function(index){
          foundItems.splice(index,1);
        };
      });
    };
  }


  NarrowItDownController.$inject = ['MenusearchService'];
  function NarrowItDownController(MenusearchService){
    var items=[];
    var vm = this;
    vm.searchstring = "";

    vm.remove = function(index){
      MenusearchService.remove(index)
    };

    vm.getMatchedMenuItems = function(){
      var promise = MenusearchService.getMatchedMenuItems(vm.searchstring);
      if(vm.searchstring == ""){
        vm.emptystring = MenusearchService.error(vm.searchstring);
        vm.noitems=false;
        vm.empty=true;
        vm.isitem=false;
        return;
      }
      
      promise.then(function (result) {
        vm.items=MenusearchService.show();
        vm.noitems=false;
        vm.empty=false;
        vm.isitem=true;

        if(vm.items.length == 0){
          vm.nomatches=MenusearchService.error(vm.items);
          vm.noitems=true;
          vm.empty=false;
          vm.isitem=false;
          return;
        }

      }).catch(function (error) {
        console.log("Something went terribly wrong.");
      });
    }
  }
})();
