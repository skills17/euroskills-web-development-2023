<?php

namespace EuroSkills\Trade17\Concerts\Tests\Clients;

use GuzzleHttp\Client;

class ApiClient extends Client
{
    public function __construct(array $config = [])
    {
        $baseUri = getenv('BASE_URL') ?: 'http://localhost/module-b/phase1/';

        if (substr($baseUri, -1) !== '/') {
            $baseUri .= '/';
        }

        parent::__construct(array_merge([
            'base_uri' => $baseUri,
            'headers' => array_merge([
                'Accept' => 'application/json',
            ], $config['headers'] ?? []),
            'http_errors' => false,
        ], $config));
    }
}
