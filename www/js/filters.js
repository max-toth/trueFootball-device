angular.module('starter.filters', [])
    .filter('filterBySport', function() {
        return function(input, value) {
            if (!value || !value.length) return input;

            var values = value.filter(function(item) {
                return item.checked;
            });

            if (!values.length) return input;

            values = values.map(function(item) {
                return item.value;
            });

            return input.filter(function(item) {
                return ~values.indexOf(item.properties.event.sport);
            });
        }
    });