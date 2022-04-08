<?php

namespace EuroSkills\Trade17\Concerts\Tests\Extra;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\WriteTest;

class TicketsCancelTest extends WriteTest
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
    public function testTicketCancel()
    {
        $res = $this->client->post('api/v1/tickets/267/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'Q8IX0CMJVZ',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($res, 204);
        $this->assertEquals(trim($res->getBody()), '');
    }

    /**
     * @medium
     */
    public function testTicketCancelUpdatesBooking()
    {
        $resBookingBefore = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'Q8IX0CMJVZ',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($resBookingBefore, 200);
        $this->assertResponseHeaderEquals($resBookingBefore, 'Content-Type', 'application/json');

        $this->assertJsonResponseEqualsIgnoringOrder($resBookingBefore, [
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

        // cancel one of the tickets
        $res = $this->client->post('api/v1/tickets/267/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'Q8IX0CMJVZ',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($res, 204);
        $this->assertEquals(trim($res->getBody()), '');

        // booking should still contain the other ticket
        $resBookingAfter = $this->client->post('api/v1/tickets', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'BS0G8HA5KX',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($resBookingAfter, 200);
        $this->assertResponseHeaderEquals($resBookingAfter, 'Content-Type', 'application/json');

        $this->assertJsonResponseEqualsIgnoringOrder($resBookingAfter, [
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
    public function testTicketCancelAllowsReservation()
    {
        $resReservationBefore = $this->client->post('api/v1/concerts/1/shows/1/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [['row' => 21, 'seat' => 11]],
            ],
        ]);

        $this->assertResponseCode($resReservationBefore, 422);
        $this->assertResponseHeaderEquals($resReservationBefore, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resReservationBefore, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 11 in row 21 is already taken.',
            ],
        ]);

        // cancel the ticket for this seat
        $res = $this->client->post('api/v1/tickets/267/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'Q8IX0CMJVZ',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($res, 204);
        $this->assertEquals(trim($res->getBody()), '');

        // reservation of the seat should now be possible
        $resReservationAfter = $this->client->post('api/v1/concerts/1/shows/1/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [['row' => 21, 'seat' => 11]],
            ],
        ]);

        $this->assertResponseCode($resReservationAfter, 201);
        $this->assertResponseHeaderEquals($resReservationAfter, 'Content-Type', 'application/json');
    }

    /**
     * @medium
     */
    public function testTicketCancelInvalidCode()
    {
        // invalid code
        $resCode = $this->client->post('api/v1/tickets/267/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => '0000000000',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($resCode, 401);
        $this->assertResponseHeaderEquals($resCode, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($resCode, [
            'error' => 'Unauthorized',
        ]);

        // invalid name
        $resName = $this->client->post('api/v1/tickets/267/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'Q8IX0CMJVZ',
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
    public function testTicketCancelInvalidId()
    {
        $resCode = $this->client->post('api/v1/tickets/0/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'Q8IX0CMJVZ',
                'name' => 'Nicole Gritsch',
            ],
        ]);

        $this->assertResponseCode($resCode, 404);
        $this->assertResponseHeaderEquals($resCode, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($resCode, [
            'error' => 'A ticket with this ID does not exist',
        ]);
    }
}
