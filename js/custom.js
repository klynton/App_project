
/***************************
MAIN CONTENT - Purchase Form
**************************/

var purchaseForm = (function(){
	var DEFAULTS = {

	}
	return {
		/****************
		VARIABLES
		****************/
		firstInput:$('#extra-btl'),
		secondInput:$('#cold-btl'),
		thirdInput:$('#garlic-btl'),
		stateSelect:$('#select-state'),
		radioButtons:$('#r-group input[type="radio"]'),
		estimateButton:$('#purchaseTotal'),
		purchaseTotal:$('#totalInput'),
		taxFactor:1,
		/*****************************/

		/*************************
		METHODS
		**************************/

		getNumberOfBottles:function()
		{
			var first = parseInt(this.firstInput.val()),
				second = parseInt(this.secondInput.val()),
				third = parseInt(this.thirdInput.val());
			return (first + second + third);
		},

		calculateTotal:function()
		{
			var first = parseInt(this.firstInput.val()),
				second = parseInt(this.secondInput.val()),
				third = parseInt(this.thirdInput.val()),
				shippingMethod,
				tax = this.taxFactor;

			var methods = $('input[name="method_r"]');

			methods.each(function(){
				if($(this).prop('checked'))
					shippingMethod = $(this).val();
			});

			if(this.stateSelect.val() === "CA") tax = 1.075;

			var shippingCostPer = (shippingMethod === 'free') ? 0 : (shippingMethod === 'usps') ? 2 : (shippingMethod === 'ups') ? 3 : 0;

			var shippingCost = (first + second + third) * shippingCostPer;

			var subtotal = ( (first * 10) + (second * 8) + (third * 10) ) * tax;

			var estimate = subtotal + shippingCost;

			return "$" + (estimate.toFixed(2));
			
		},

		submitHandler:function(event)
		{
			event.preventDefault();

			purchaseForm.purchaseTotal.val(purchaseForm.calculateTotal());
		}
	}
})();

/******************************
PURCHASE FORM - EVENT HANDLERS
*****************************/

$('#purchaseForm').submit(purchaseForm.submitHandler);

/************************/

/**********************
GENERAL PAGE FUNCTIONS
*********************/

$(document).click(function(e){
	if( regulateNavMenuNotSelected(e) )
	{
		$('.slideOutMenu').toggleClass('active');
	}
});

$('.slideOutToggle').click(function(event){
	var nextElement = $(this).next();
	nextElement.toggleClass('active');
});

$('.slideOutMenu a').click(function(event){
	var grandParentElement = $(this).parent().parent();
	grandParentElement.toggleClass('active');
});

function regulateNavMenuNotSelected(e)
{
	var containers = $('.slideOutMenu,.slideOutToggle');
	return( !containers.is(e.target) && 
			containers.has(e.target).length === 0 &&
			containers.hasClass('active') );
}



/****************************************/