<?php

namespace EuroSkills\Trade17\Concerts\Tests;

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
        $res = $this->client->post('api/v1/tickets/109/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'BLPEMQYDVF',
                'name' => 'Marlene Binder',
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
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($resBookingBefore, 200);
        $this->assertResponseHeaderEquals($resBookingBefore, 'Content-Type', 'application/json');

        $this->assertJsonResponseEqualsIgnoringOrder($resBookingBefore, [
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

        // cancel one of the tickets
        $res = $this->client->post('api/v1/tickets/109/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'BLPEMQYDVF',
                'name' => 'Marlene Binder',
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
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($resBookingAfter, 200);
        $this->assertResponseHeaderEquals($resBookingAfter, 'Content-Type', 'application/json');

        $this->assertJsonResponseEqualsIgnoringOrder($resBookingAfter, [
            'tickets' => [
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
    public function testTicketCancelAllowsReservation()
    {
        $resReservationBefore = $this->client->post('api/v1/concerts/2/shows/2/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [['row' => 52, 'seat' => 9]],
            ],
        ]);

        $this->assertResponseCode($resReservationBefore, 422);
        $this->assertResponseHeaderEquals($resReservationBefore, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resReservationBefore, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 9 in row 52 is already taken.',
            ],
        ]);

        // cancel the ticket for this seat
        $res = $this->client->post('api/v1/tickets/109/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'BLPEMQYDVF',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($res, 204);
        $this->assertEquals(trim($res->getBody()), '');

        // reservation of the seat should now be possible
        $resReservationAfter = $this->client->post('api/v1/concerts/2/shows/2/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [['row' => 52, 'seat' => 9]],
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
        $resCode = $this->client->post('api/v1/tickets/109/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($resCode, 401);
        $this->assertResponseHeaderEquals($resCode, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($resCode, [
            'error' => 'Unauthorized',
        ]);

        // invalid name
        $resName = $this->client->post('api/v1/tickets/109/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'BLPEMQYDVF',
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
    public function testTicketCancelInvalidId()
    {
        $resCode = $this->client->post('api/v1/tickets/10905/cancel', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'code' => 'ANY9VIBEQC',
                'name' => 'Marlene Binder',
            ],
        ]);

        $this->assertResponseCode($resCode, 404);
        $this->assertResponseHeaderEquals($resCode, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($resCode, [
            'error' => 'A ticket with this ID does not exist',
        ]);
    }
}
