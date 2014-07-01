angular.module('starter.filters', [])
    .filter('filterBySport', function() {
        return function(input, value) {
            if (!value || !value.length) return input;
            return input.filter(function(item) {
                return ~value.indexOf(item.properties.event.sport);
            });
        }
    });