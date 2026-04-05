<?php

return [
    'client_id' => env('PAYPAL_CLIENT_ID'),
    'secret' => env('PAYPAL_CLIENT_SECRET'),
    'environment' => env('PAYPAL_ENVIRONMENT', 'sandbox'),
    'currency' => env('PAYPAL_CURRENCY', 'USD'),
];
