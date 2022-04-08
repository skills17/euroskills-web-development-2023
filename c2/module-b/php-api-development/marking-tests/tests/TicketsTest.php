<?php

namespace EuroSkills\Trade17\Concerts\Tests;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\ReadTest;

class TicketsTest extends ReadTest
{
    use ResponseAsserts;

    protected $client;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = new ApiClient();
    }

    /**
     * @medium
     */
    public function testTicketsValidCode()
    {
        $res = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // ignores array orders so wrong sortings will still pass the test
        // additionally, the following gets ignored as well: types, additional properties and
        // different date formats as long as they are still ISO 8601
        $this->assertJsonResponseEqualsIgnoringOrder($res, [
            'tickets' => [
                [
                    'id' => 109,
                    'code' => 'BLPEMQYDVF',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 9,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
                [
                    'id' => 108,
                    'code' => 'ANY9VIBEQC',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 10,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testTicketsValidCodeDifferentTicket()
    {
        $res = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'BLPEMQYDVF',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // ignores array orders so wrong sortings will still pass the test
        // additionally, the following gets ignored as well: types, additional properties and
        // different date formats as long as they are still ISO 8601
        $this->assertJsonResponseEqualsIgnoringOrder($res, [
            'tickets' => [
                [
                    'id' => 109,
                    'code' => 'BLPEMQYDVF',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 9,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
                [
                    'id' => 108,
                    'code' => 'ANY9VIBEQC',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 10,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testTicketsCorrectSorting()
    {
        $res = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // the items in an array have to be in the exact same order
        // additionally, the following gets ignored: types, additional properties and
        // different date formats as long as they are still ISO 8601
        $this->assertJsonResponseEquals($res, [
            'tickets' => [
                [
                    'id' => 109,
                    'code' => 'BLPEMQYDVF',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 9,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
                [
                    'id' => 108,
                    'code' => 'ANY9VIBEQC',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 10,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testTicketsStrictEquals()
    {
        $res = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // sorting and all types have to be equal to the expected ones
        // additional properties not specified in the API documentation are no longer allowed
        // but different date formats will still pass as long as they are still ISO 8601 (e.g. 2021-09-30T20:30:00.000000Z)
        $this->assertJsonResponseStrictEquals($res, [
            'tickets' => [
                [
                    'id' => 109,
                    'code' => 'BLPEMQYDVF',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 9,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
                [
                    'id' => 108,
                    'code' => 'ANY9VIBEQC',
                    'name' => 'Marlene Binder',
                    'created_at' => '2021-06-23T17:54:09Z',
                    'row' => [
                        'id' => 52,
                        'name' => 'B',
                    ],
                    'seat' => 10,
                    'show' => [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                        'concert' => [
                            'id' => 2,
                            'artist' => 'Bilderbuch',
                            'location' => [
                                'id' => 3,
                                'name' => 'Das Orpheum',
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testTicketsInvalidCode()
    {
        // invalid code
        $resCode = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ZFKESP6UDA',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($resCode, 401);
        $this->assertResponseHeaderEquals($resCode, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($resCode, [
            'error' => 'Unauthorized',
        ]);

        // invalid name
        $resName = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ANY9VIBEQC',
                'name' => 'Ralph Sattler',
            ],
        ]);

        $this->assertResponseCode($resName, 401);
        $this->assertResponseHeaderEquals($resName, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($resName, [
            'error' => 'Unauthorized',
        ]);
    }

    /**
     * @medium
     */
    public function testTicketsGetCreatedAfterBooking()
    {
        // place reservation
        $resReservation = $this->client->post('api/v1/concerts/1/shows/1/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => array_merge([
                'reservations' => [['row' => 2, 'seat' => 30], ['row' => 2, 'seat' => 31]],
            ]),
        ]);

        $this->assertResponseCode($resReservation, 201);
        $this->assertResponseHeaderEquals($resReservation, 'Content-Type', 'application/json');
        $resReservationData = json_decode($resReservation->getBody(), true);

        $this->assertTrue(
            isset($resReservationData['reservation_token']) && is_string($resReservationData['reservation_token']) && strlen($resReservationData['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resReservationData, JSON_PRETTY_PRINT)
        );

        $reservationToken = $resReservationData['reservation_token'];

        // create booking from reservation
        $resBooking = $this->client->post('api/v1/concerts/1/shows/1/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $reservationToken,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);
        $resBookingData = json_decode($resBooking->getBody(), true);

        $this->assertResponseCode($resBooking, 201);
        $this->assertResponseHeaderEquals($resBooking, 'Content-Type', 'application/json');
        $this->assertTrue(isset($resBookingData['tickets']) && isset($resBookingData['tickets'][0]) && isset($resBookingData['tickets'][0]['code']), 'Expected first ticket to contain a code.');
        $this->assertTrue(isset($resBookingData['tickets']) && isset($resBookingData['tickets'][1]) && isset($resBookingData['tickets'][1]['code']), 'Expected second ticket to contain a code.');

        // query tickets
        $resTickets = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => $resBookingData['tickets'][0]['code'],
                'name' => 'John Doe',
            ],
        ]);

        $this->assertResponseCode($resTickets, 200);
        $this->assertResponseHeaderEquals($resTickets, 'Content-Type', 'application/json');

        // ignores array orders so wrong sortings will still pass the test
        // additionally, the following gets ignored as well: types, additional properties and
        // different date formats as long as they are still ISO 8601
        $this->assertJsonResponseEqualsIgnoringOrder($resTickets, [
            'tickets' => [
                [
                    'code' => $resBookingData['tickets'][0]['code'],
                    'name' => 'John Doe',
                    'row' => [
                        'id' => 2,
                        'name' => 'Stalls 02',
                    ],
                    'seat' => 30,
                    'show' => [
                        'id' => 1,
                        'start' => '2021-10-02T19:00:00Z',
                        'end' => '2021-10-02T22:00:00Z',
                        'concert' => [
                            'id' => 1,
                            'artist' => 'Opus',
                            'location' => [
                                'id' => 1,
                                'name' => 'Oper Graz',
                            ],
                        ],
                    ],
                ],
                [
                    'code' => $resBookingData['tickets'][1]['code'],
                    'name' => 'John Doe',
                    'row' => [
                        'id' => 2,
                        'name' => 'Stalls 02',
                    ],
                    'seat' => 31,
                    'show' => [
                        'id' => 1,
                        'start' => '2021-10-02T19:00:00Z',
                        'end' => '2021-10-02T22:00:00Z',
                        'concert' => [
                            'id' => 1,
                            'artist' => 'Opus',
                            'location' => [
                                'id' => 1,
                                'name' => 'Oper Graz',
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }
}
