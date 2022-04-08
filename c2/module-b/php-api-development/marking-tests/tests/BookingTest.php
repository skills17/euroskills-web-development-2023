<?php

namespace EuroSkills\Trade17\Concerts\Tests;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use PDO;
use Skills17\PHPUnit\Database\WriteTest;

class BookingTest extends WriteTest
{
    use ResponseAsserts;

    protected $client;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = new ApiClient();
    }

    public function placeReservation(int $concert, int $show, array $seats, $reservationToken = null)
    {
        $res = $this->client->post('api/v1/concerts/'.$concert.'/shows/'.$show.'/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => array_merge([
                'reservations' => $seats,
            ], $reservationToken !== null ? ['reservation_token' => $reservationToken] : []),
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');
        $resData = json_decode($res->getBody(), true);

        $this->assertTrue(
            isset($resData['reservation_token']) && is_string($resData['reservation_token']) && strlen($resData['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resData, JSON_PRETTY_PRINT)
        );

        return $resData['reservation_token'];
    }

    /**
     * @medium
     */
    public function testBookingOneSeat()
    {
        $token = $this->placeReservation(2, 4, [['row' => 84, 'seat' => 11]]);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // some fields (like id, code, created_at) are not tested in this assert but in a later one
        $this->assertJsonResponseEqualsIgnoringOrder($res, [
            'tickets' => [
                [
                    'name' => 'John Doe',
                    'row' => [
                        'id' => 84,
                        'name' => 'F',
                    ],
                    'seat' => 11,
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

        $resData = json_decode($res->getBody(), true);
        $this->assertTrue(isset($resData['tickets'][0]['id']), "Expected \"id\" to exists. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));

        // assert code
        $this->assertTrue(isset($resData['tickets'][0]['code']) && is_string($resData['tickets'][0]['code']), "Expected a code to be generated. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertTrue(strlen($resData['tickets'][0]['code']) === 10, 'Expected code to be 10 characters long but received one is '.strlen($resData['tickets'][0]['code']).' characters.');
        $this->assertTrue(preg_match('/^[A-Z0-9]{10}$/', $resData['tickets'][0]['code']) === 1, 'Expected code to only contain uppercase alphanumeric characters but received "'.$resData['tickets'][0]['code'].'".');

        // assert created_at
        $this->assertTrue(isset($resData['tickets'][0]['created_at']), "Expected \"created_at\" to exists. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($resData['tickets'][0]['created_at']),
            'Expected "reserved_until" to be in a valid ISO8601 datetime format but received "'.$resData['tickets'][0]['created_at'].'".'
        );
        $creationDate = strtotime($resData['tickets'][0]['created_at']);
        $this->assertTrue(
            $creationDate >= time() - 10 && $creationDate <= time() + 10,
            'Expected creation date of ticket to equal the current timestamp. Received "created_at": '.$resData['tickets'][0]['created_at']
        );
    }

    /**
     * @medium
     */
    public function testBookingMultipleSeats()
    {
        $token = $this->placeReservation(2, 4, [['row' => 84, 'seat' => 12], ['row' => 83, 'seat' => 1]]);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'Someone Else',
                'address' => 'Street 1',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // some fields (like id, code, created_at) are not tested in this assert but in a later one
        $this->assertJsonResponseEqualsIgnoringOrder($res, [
            'tickets' => [
                [
                    'name' => 'Someone Else',
                    'row' => [
                        'id' => 83,
                        'name' => 'E',
                    ],
                    'seat' => 1,
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
                [
                    'name' => 'Someone Else',
                    'row' => [
                        'id' => 84,
                        'name' => 'F',
                    ],
                    'seat' => 12,
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

        $resData = json_decode($res->getBody(), true);
        $this->assertTrue(isset($resData['tickets'][0]['id']), "Expected \"id\" for first ticket to exists. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertTrue(isset($resData['tickets'][1]['id']), "Expected \"id\" for second ticket to exists. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));

        // assert code
        $this->assertTrue(isset($resData['tickets'][0]['code']) && is_string($resData['tickets'][0]['code']), "Expected a code to be generated for the first ticket. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertTrue(isset($resData['tickets'][1]['code']) && is_string($resData['tickets'][1]['code']), "Expected a code to be generated for the second ticket. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertTrue(strlen($resData['tickets'][0]['code']) === 10, 'Expected code for the first ticket to be 10 characters long but received one is '.strlen($resData['tickets'][0]['code']).' characters.');
        $this->assertTrue(strlen($resData['tickets'][1]['code']) === 10, 'Expected code for the second ticket to be 10 characters long but received one is '.strlen($resData['tickets'][1]['code']).' characters.');
        $this->assertTrue(preg_match('/^[A-Z0-9]{10}$/', $resData['tickets'][0]['code']) === 1, 'Expected code for the first ticket to only contain uppercase alphanumeric characters but received "'.$resData['tickets'][0]['code'].'".');
        $this->assertTrue(preg_match('/^[A-Z0-9]{10}$/', $resData['tickets'][1]['code']) === 1, 'Expected code for the second ticket to only contain uppercase alphanumeric characters but received "'.$resData['tickets'][1]['code'].'".');
        $this->assertNotEquals($resData['tickets'][0]['code'], $resData['tickets'][1]['code'], 'Expected to have a different random code for each ticket.');

        // assert created_at
        $this->assertTrue(isset($resData['tickets'][0]['created_at']), "Expected \"created_at\" for first ticket to exists. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertTrue(isset($resData['tickets'][1]['created_at']), "Expected \"created_at\" for second ticket to exists. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($resData['tickets'][0]['created_at']),
            'Expected "reserved_until" for first ticket to be in a valid ISO8601 datetime format but received "'.$resData['tickets'][0]['created_at'].'".'
        );
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($resData['tickets'][1]['created_at']),
            'Expected "reserved_until" for second ticket to be in a valid ISO8601 datetime format but received "'.$resData['tickets'][1]['created_at'].'".'
        );
        $creationDate1 = strtotime($resData['tickets'][0]['created_at']);
        $this->assertTrue(
            $creationDate1 >= time() - 10 && $creationDate1 <= time() + 10,
            'Expected creation date of first ticket to equal the current timestamp. Received "created_at": '.$resData['tickets'][0]['created_at']
        );
        $creationDate2 = strtotime($resData['tickets'][1]['created_at']);
        $this->assertTrue(
            $creationDate2 >= time() - 10 && $creationDate2 <= time() + 10,
            'Expected creation date of second ticket to equal the current timestamp. Received "created_at": '.$resData['tickets'][1]['created_at']
        );
    }

    /**
     * @medium
     */
    public function testBookingMultipleSeatsCorrectSorting()
    {
        $token = $this->placeReservation(2, 4, [['row' => 84, 'seat' => 12], ['row' => 83, 'seat' => 1]]);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'Someone Else',
                'address' => 'Street 1',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // some fields (like id, code, created_at) are not tested in this assert but in a later one
        $this->assertJsonResponseEquals($res, [
            'tickets' => [
                [
                    'name' => 'Someone Else',
                    'row' => [
                        'id' => 83,
                        'name' => 'E',
                    ],
                    'seat' => 1,
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
                [
                    'name' => 'Someone Else',
                    'row' => [
                        'id' => 84,
                        'name' => 'F',
                    ],
                    'seat' => 12,
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

    /**
     * @medium
     */
    public function testBookingAddressData()
    {
        $token = $this->placeReservation(2, 4, [['row' => 92, 'seat' => 15]]);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // since the address data is not exposed in the API, manual DB queries are needed
        $sql = 'SELECT id, name, address, city, zip, country FROM `bookings` WHERE name = \'John Doe\'';
        $rows = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        $this->assertJsonStrictEquals($rows, [
            [
                'id' => '61',
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testBookingDifferentShows()
    {
        $tokenShow4 = $this->placeReservation(2, 4, [['row' => 84, 'seat' => 13]]);
        $tokenShow2 = $this->placeReservation(2, 2, [['row' => 51, 'seat' => 8]], $tokenShow4);

        $this->assertEquals($tokenShow4, $tokenShow2);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $tokenShow4,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // some fields (like id, code, created_at) are not tested
        $this->assertJsonResponseEquals($res, [
            'tickets' => [
                [
                    'name' => 'John Doe',
                    'row' => [
                        'id' => 84,
                        'name' => 'F',
                    ],
                    'seat' => 13,
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

    /**
     * @medium
     */
    public function testBookingSeatGetsUnavailable()
    {
        $token = $this->placeReservation(2, 4, [['row' => 84, 'seat' => 14]]);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // seat should no longer be bookable
        $resError = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [['row' => 84, 'seat' => 14]],
            ],
        ]);

        $this->assertResponseCode($resError, 422);
        $this->assertResponseHeaderEquals($resError, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resError, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 14 in row 84 is already taken.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testBookingInvalidToken()
    {
        // use a token that does not exist
        $resInvalid = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => '__invalid_token_61a994ef64d2c40d0dd76d5111648f4fe7fb092c',
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($resInvalid, 401);
        $this->assertResponseHeaderEquals($resInvalid, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resInvalid, [
            'error' => 'Unauthorized',
        ]);
    }

    /**
     * @medium
     */
    public function testBookingValidationRequiredFields()
    {
        $token = $this->placeReservation(2, 4, [['row' => 86, 'seat' => 7]]);

        $res1 = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
            ],
        ]);

        $this->assertResponseCode($res1, 422);
        $this->assertResponseHeaderEquals($res1, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($res1, [
            'error' => 'Validation failed',
            'fields' => [
                'name' => 'The name field is required.',
                'address' => 'The address field is required.',
                'city' => 'The city field is required.',
                'zip' => 'The zip field is required.',
                'country' => 'The country field is required.',
            ],
        ]);

        $res2 = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res2, 422);
        $this->assertResponseHeaderEquals($res2, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($res2, [
            'error' => 'Validation failed',
            'fields' => [
                'reservation_token' => 'The reservation token field is required.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testBookingValidationStringFields()
    {
        $token = $this->placeReservation(2, 4, [['row' => 86, 'seat' => 8]]);

        $res = $this->client->post('api/v1/concerts/2/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 1,
                'address' => 2,
                'city' => 3,
                'zip' => 4,
                'country' => 5,
            ],
        ]);

        $this->assertResponseCode($res, 422);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'Validation failed',
            'fields' => [
                'name' => 'The name must be a string.',
                'address' => 'The address must be a string.',
                'city' => 'The city must be a string.',
                'zip' => 'The zip must be a string.',
                'country' => 'The country must be a string.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testBookingConcertDoesNotExist()
    {
        $token = $this->placeReservation(2, 4, [['row' => 86, 'seat' => 9]]);

        $res = $this->client->post('api/v1/concerts/20/shows/4/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }

    /**
     * @medium
     */
    public function testBookingShowDoesNotExist()
    {
        $token = $this->placeReservation(2, 4, [['row' => 86, 'seat' => 10]]);

        $res = $this->client->post('api/v1/concerts/2/shows/40/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }

    /**
     * @medium
     */
    public function testBookingShowDoesNotBelongToConcert()
    {
        $token = $this->placeReservation(2, 4, [['row' => 86, 'seat' => 11]]);

        $res = $this->client->post('api/v1/concerts/2/shows/1/booking', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $token,
                'name' => 'John Doe',
                'address' => 'Bahnhofstrasse 15',
                'city' => 'Graz',
                'zip' => '8010',
                'country' => 'Austria',
            ],
        ]);

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }
}
