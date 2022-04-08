<?php

namespace EuroSkills\Trade17\Concerts\Tests\Extra;

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
                'code' => 'F87HBCWKI9',
                'name' => 'Nicole Gritsch',
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
                    'id' => 269,
                    'code' => 'F87HBCWKI9',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 10,
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
                    'id' => 267,
                    'code' => 'Q8IX0CMJVZ',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 11,
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
                    'id' => 268,
                    'code' => 'BS0G8HA5KX',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 12,
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
                'code' => 'Q8IX0CMJVZ',
                'name' => 'Nicole Gritsch',
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
                    'id' => 269,
                    'code' => 'F87HBCWKI9',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 10,
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
                    'id' => 267,
                    'code' => 'Q8IX0CMJVZ',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 11,
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
                    'id' => 268,
                    'code' => 'BS0G8HA5KX',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 12,
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
                'code' => 'F87HBCWKI9',
                'name' => 'Nicole Gritsch',
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
                    'id' => 269,
                    'code' => 'F87HBCWKI9',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 10,
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
                    'id' => 267,
                    'code' => 'Q8IX0CMJVZ',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 11,
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
                    'id' => 268,
                    'code' => 'BS0G8HA5KX',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 12,
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
                'code' => 'F87HBCWKI9',
                'name' => 'Nicole Gritsch',
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
                    'id' => 269,
                    'code' => 'F87HBCWKI9',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 10,
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
                    'id' => 267,
                    'code' => 'Q8IX0CMJVZ',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 11,
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
                    'id' => 268,
                    'code' => 'BS0G8HA5KX',
                    'name' => 'Nicole Gritsch',
                    'created_at' => '2021-08-11T10:30:14Z',
                    'row' => [
                        'id' => 21,
                        'name' => 'Terrace 3',
                    ],
                    'seat' => 12,
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
                'code' => '0000000000',
                'name' => 'Valentin Hartl',
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
                'name' => 'Aaa',
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
        $resReservation = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => array_merge([
                'reservations' => [['row' => 92, 'seat' => 14]],
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
        $resBooking = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $reservationToken,
                'name' => 'Max Frisch',
                'address' => 'Bahnhofstrasse 16',
                'city' => 'Zurich',
                'zip' => '8000',
                'country' => 'Switzerland',
            ],
        ]);
        $resBookingData = json_decode($resBooking->getBody(), true);

        $this->assertResponseCode($resBooking, 201);
        $this->assertResponseHeaderEquals($resBooking, 'Content-Type', 'application/json');
        $this->assertTrue(isset($resBookingData['tickets']) && isset($resBookingData['tickets'][0]) && isset($resBookingData['tickets'][0]['code']), 'Expected first ticket to contain a code.');

        // query tickets
        $resTickets = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => $resBookingData['tickets'][0]['code'],
                'name' => 'Max Frisch',
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
                    'name' => 'Max Frisch',
                    'row' => [
                        'id' => 92,
                        'name' => 'N',
                    ],
                    'seat' => 14,
                    'show' => [
                        'id' => 4,
                        'start' => '2021-09-30T20:30:00Z',
                        'end' => '2021-09-30T22:30:00Z',
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
}
