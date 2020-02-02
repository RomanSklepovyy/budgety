var budgetController = (function () {


})();



var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelectorAll(DOMstrings.inputDescription).value,
                inputValue: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings : function () {
            return DOMstrings;
        }
    };

})();



var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListners = function () {

        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function (event) {
            if(event.keyCode === 13 || event.which === 12) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        
        // Get input data
        var input = UICtrl.getInput();
        console.log(input);

        // Add item to the budget controller


        // Add item to the UI


        // Calculate budget


        // Display the buget on the UI

    };
    
    return {
        init: function () {
            setupEventListners();
        }
    }
    
})(budgetController, UIController);

controller.init();