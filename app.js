var budgetController = (function () {


})();



var UIController = (function () {


})();



var controller = (function (budgetCtrl, UICtrl) {

var addItem = function () {

    // Get input data

    // Add item to the budget controller

    // Add item to the UI

    // Calculate budget

    // Display the buget on the UI
};

document.querySelector('.add__btn').addEventListener('click', addItem);

document.addEventListener('keypress', function (event) {
   if(event.keyCode === 13 || event.which === 12) {
       addItem();
   }
});

})(budgetController, UIController);