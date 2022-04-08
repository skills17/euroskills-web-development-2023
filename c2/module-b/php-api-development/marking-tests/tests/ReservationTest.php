<?php

namespace EuroSkills\Trade17\Concerts\Tests;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\WriteTest;

class ReservationTest extends WriteTest
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
    public function testReservationCreation()
    {
        $res1 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 84,
                        'seat' => 1,
                    ],
                    [
                        'row' => 84,
                        'seat' => 2,
                    ],
                ],
            ],
        ]);

        $res2 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 87,
                        'seat' => 14,
                    ],
                    [
                        'row' => 87,
                        'seat' => 15,
                    ],
                ],
            ],
        ]);

        // check status codes
        $this->assertResponseCode($res1, 201);
        $this->assertResponseCode($res2, 201);

        // check JSON response of reservation requests
        $this->assertResponseHeaderEquals($res1, 'Content-Type', 'application/json');
        $this->assertResponseHeaderEquals($res2, 'Content-Type', 'application/json');
        $res1Data = json_decode($res1->getBody(), true);
        $res2Data = json_decode($res2->getBody(), true);
        $this->assertTrue(
            isset($res1Data['reserved']) && $res1Data['reserved'] === true,
            "Expected \"reserved\" to exist and equal true. Received:\n".json_encode($res1Data, JSON_PRETTY_PRINT)
        );
        $this->assertTrue(
            isset($res2Data['reserved']) && $res2Data['reserved'] === true,
            "Expected \"reserved\" to exist and equal true. Received:\n".json_encode($res2Data, JSON_PRETTY_PRINT)
        );
        $this->assertTrue(
            isset($res1Data['reservation_token']) && is_string($res1Data['reservation_token']) && strlen($res1Data['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($res1Data, JSON_PRETTY_PRINT)
        );
        $this->assertTrue(
            isset($res2Data['reservation_token']) && is_string($res2Data['reservation_token']) && strlen($res2Data['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($res2Data, JSON_PRETTY_PRINT)
        );
        $this->assertNotEquals($res1Data['reservation_token'], $res2Data['reservation_token'], 'Expected that the "reservation_token" is randomly generated.');

        // check if the reserved_until timestamps are valid and equal the default value
        $this->assertTrue(isset($res1Data['reserved_until']), "Expected \"reserved_until\" to exist. Received:\n".json_encode($res1Data, JSON_PRETTY_PRINT));
        $this->assertTrue(isset($res2Data['reserved_until']), "Expected \"reserved_until\" to exist. Received:\n".json_encode($res2Data, JSON_PRETTY_PRINT));
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($res1Data['reserved_until']),
            'Expected "reserved_until" to be in a valid ISO8601 datetime format but received "'.$res1Data['reserved_until'].'".'
        );
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($res2Data['reserved_until']),
            'Expected "reserved_until" to be in a valid ISO8601 datetime format but received "'.$res2Data['reserved_until'].'".'
        );
        $res1Expiration = strtotime($res1Data['reserved_until']);
        $res2Expiration = strtotime($res2Data['reserved_until']);
        $expectedExpiration = time() + 300;
        $this->assertTrue(
            $res1Expiration >= $expectedExpiration - 10 && $res1Expiration <= $expectedExpiration + 10,
            'Expected reservation to expire in 300 seconds. Received "reserved_until": '.$res1Data['reserved_until']
        );
        $this->assertTrue(
            $res2Expiration >= $expectedExpiration - 10 && $res2Expiration <= $expectedExpiration + 10,
            'Expected reservation to expire in 300 seconds. Received "reserved_until": '.$res2Data['reserved_until']
        );
    }

    /**
     * @medium
     */
    public function testReservationUpdatesUnavailableSeats()
    {
        $seatingBefore = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->testReservationCreation();
        $seatingAfter = $this->client->get('api/v1/concerts/2/shows/4/seating');

        // test reservation updates the unavailable seats by comparing before and after
        $this->assertJsonResponseEqualsIgnoringOrder($seatingBefore, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // test reservation updates the unavailable seats by comparing before and after
        $this->assertJsonResponseEqualsIgnoringOrder($seatingAfter, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [1, 2, 15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12, 14, 15]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationExpiration()
    {
        $res = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 84,
                        'seat' => 3,
                    ],
                ],
                'duration' => 3,
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $resData = json_decode($res->getBody(), true);

        // check expiration time
        $this->assertTrue(isset($resData['reserved_until']), "Expected \"reserved_until\" to exist. Received:\n".json_encode($resData, JSON_PRETTY_PRINT));
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($resData['reserved_until']),
            'Expected "reserved_until" to be in a valid ISO8601 datetime format but received "'.$resData['reserved_until'].'".'
        );
        $resExpiration = strtotime($resData['reserved_until']);
        $expectedExpiration = time() + 3;
        $this->assertTrue(
            $resExpiration >= $expectedExpiration - 5 && $resExpiration <= $expectedExpiration + 5,
            'Expected reservation to expire in 300 seconds. Received "reserved_until": '.$resData['reserved_until']
        );

        // check if seat is marked as unavailable now
        $seatingNow = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seatingNow, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [3, 15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // check if seat is available again after some delay
        sleep(5);
        $seatingAfterDelay = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seatingAfterDelay, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationOfUnavailableSeats()
    {
        // one of two seats is unavailable
        $res1 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 81,
                        'seat' => 3,
                    ],
                    [
                        'row' => 81,
                        'seat' => 4,
                    ],
                ],
            ],
        ]);

        // all seats are unavailable
        $res2 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 81,
                        'seat' => 8,
                    ],
                    [
                        'row' => 81,
                        'seat' => 9,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($res1, 422);
        $this->assertResponseCode($res2, 422);

        $this->assertResponseHeaderEquals($res1, 'Content-Type', 'application/json');
        $this->assertResponseHeaderEquals($res2, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res1, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 4 in row 81 is already taken.',
            ],
        ]);
        $this->assertJsonResponseStrictEquals($res2, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 8 in row 81 is already taken.',
            ],
        ]);

        // previously available seat becomes unavailable
        $res3 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 79,
                        'seat' => 1,
                    ],
                ],
            ],
        ]);
        $res4 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 79,
                        'seat' => 1,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($res3, 201);
        $this->assertResponseCode($res4, 422);

        $this->assertResponseHeaderEquals($res3, 'Content-Type', 'application/json');
        $this->assertResponseHeaderEquals($res4, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res4, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 1 in row 79 is already taken.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationReplacement()
    {
        $res = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 90,
                        'seat' => 1,
                    ],
                    [
                        'row' => 90,
                        'seat' => 2,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $resData = json_decode($res->getBody(), true);
        $this->assertTrue(
            isset($resData['reservation_token']) && is_string($resData['reservation_token']) && strlen($resData['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resData, JSON_PRETTY_PRINT)
        );

        // check if the reserved seats are now unavailable
        $seating1 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seating1, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => [1, 2]]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // replace reservation with fewer seats in different row
        $resReplaced1 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $resData['reservation_token'],
                'reservations' => [
                    [
                        'row' => 91,
                        'seat' => 5,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resReplaced1, 201);
        $this->assertResponseHeaderEquals($resReplaced1, 'Content-Type', 'application/json');
        $resReplaced1Data = json_decode($resReplaced1->getBody(), true);
        $this->assertTrue(
            isset($resReplaced1Data['reserved']) && $resReplaced1Data['reserved'] === true,
            "Expected \"reserved\" to exist and equal true. Received:\n".json_encode($resReplaced1Data, JSON_PRETTY_PRINT)
        );
        $this->assertTrue(
            isset($resReplaced1Data['reservation_token']) && is_string($resReplaced1Data['reservation_token']) && strlen($resReplaced1Data['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resReplaced1Data, JSON_PRETTY_PRINT)
        );
        $this->assertEquals($resData['reservation_token'], $resReplaced1Data['reservation_token'], 'Expected "reservation_token" to not change but got a different one.');
        $this->assertTrue(isset($resReplaced1Data['reserved_until']), "Expected \"reserved_until\" to exist. Received:\n".json_encode($resReplaced1Data, JSON_PRETTY_PRINT));
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($resReplaced1Data['reserved_until']),
            'Expected "reserved_until" to be in a valid ISO8601 datetime format but received "'.$resReplaced1Data['reserved_until'].'".'
        );

        // check if the reserved seats are changed in the seating
        $seating1 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seating1, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => [5]]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // replace reservation with more seats in different row
        $resReplaced2 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $resData['reservation_token'],
                'reservations' => [
                    [
                        'row' => 92,
                        'seat' => 10,
                    ],
                    [
                        'row' => 92,
                        'seat' => 11,
                    ],
                    [
                        'row' => 92,
                        'seat' => 12,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resReplaced2, 201);
        $this->assertResponseHeaderEquals($resReplaced2, 'Content-Type', 'application/json');
        $resReplaced2Data = json_decode($resReplaced2->getBody(), true);
        $this->assertTrue(
            isset($resReplaced2Data['reserved']) && $resReplaced2Data['reserved'] === true,
            "Expected \"reserved\" to exist and equal true. Received:\n".json_encode($resReplaced2Data, JSON_PRETTY_PRINT)
        );
        $this->assertTrue(
            isset($resReplaced2Data['reservation_token']) && is_string($resReplaced2Data['reservation_token']) && strlen($resReplaced2Data['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resReplaced2Data, JSON_PRETTY_PRINT)
        );
        $this->assertEquals($resData['reservation_token'], $resReplaced2Data['reservation_token'], 'Expected "reservation_token" to not change but got a different one.');
        $this->assertTrue(isset($resReplaced2Data['reserved_until']), "Expected \"reserved_until\" to exist. Received:\n".json_encode($resReplaced2Data, JSON_PRETTY_PRINT));
        $this->assertEquals(
            ['iso8601' => true, 'time' => true],
            $this->isIso8601Date($resReplaced2Data['reserved_until']),
            'Expected "reserved_until" to be in a valid ISO8601 datetime format but received "'.$resReplaced2Data['reserved_until'].'".'
        );

        // check if the reserved seats are changed in the seating
        $seating2 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seating2, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => [10, 11, 12]]],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationInvalidToken()
    {
        $res = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => '__invalid_token_61a994ef64d2ca0d0dd76d5111648f4fe7fb092c',
                'reservations' => [
                    [
                        'row' => 91,
                        'seat' => 5,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($res, 403);
        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'Invalid reservation token',
        ]);
    }

    /**
     * @medium
     */
    public function testReservationDeletion()
    {
        $res = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 89,
                        'seat' => 1,
                    ],
                    [
                        'row' => 89,
                        'seat' => 2,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($res, 201);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $resData = json_decode($res->getBody(), true);
        $this->assertTrue(
            isset($resData['reservation_token']) && is_string($resData['reservation_token']) && strlen($resData['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resData, JSON_PRETTY_PRINT)
        );

        // check if the reserved seats are now unavailable
        $seating1 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seating1, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => [1, 2]]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // delete reservation
        $resDelete = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $resData['reservation_token'],
                'reservations' => [],
            ],
        ]);

        $this->assertResponseCode($resDelete, 201);
        $this->assertResponseHeaderEquals($resDelete, 'Content-Type', 'application/json');

        // check if the reserved seats are available again
        $seating2 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seating2, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationTokenOnOtherShow()
    {
        $resShow4 = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 89,
                        'seat' => 3,
                    ],
                    [
                        'row' => 89,
                        'seat' => 4,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resShow4, 201);
        $this->assertResponseHeaderEquals($resShow4, 'Content-Type', 'application/json');

        $resShow4Data = json_decode($resShow4->getBody(), true);
        $this->assertTrue(
            isset($resShow4Data['reservation_token']) && is_string($resShow4Data['reservation_token']) && strlen($resShow4Data['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resShow4Data, JSON_PRETTY_PRINT)
        );

        // check if the reserved seats are now unavailable
        $seatingShow4 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seatingShow4, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => [3, 4]]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // place reservation with same token for a different show
        $resShow2 = $this->client->post('api/v1/concerts/2/shows/2/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservation_token' => $resShow4Data['reservation_token'],
                'reservations' => [
                    [
                        'row' => 53,
                        'seat' => 8,
                    ],
                    [
                        'row' => 53,
                        'seat' => 9,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resShow2, 201);
        $this->assertResponseHeaderEquals($resShow2, 'Content-Type', 'application/json');

        $resShow2Data = json_decode($resShow2->getBody(), true);
        $this->assertTrue(
            isset($resShow2Data['reservation_token']) && is_string($resShow2Data['reservation_token']) && strlen($resShow2Data['reservation_token']) > 1,
            "Expected \"reservation_token\" to exist and be a random string. Received:\n".json_encode($resShow2Data, JSON_PRETTY_PRINT)
        );
        $this->assertEquals($resShow4Data['reservation_token'], $resShow2Data['reservation_token'], 'Expected "reservation_token" to not change but got a different one.');

        // reservation should still be there for show 4
        $seatingShow4 = $this->client->get('api/v1/concerts/2/shows/4/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seatingShow4, [
            'rows' => [
                ['id' => 79, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 80, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [2, 3, 4, 5, 6, 7, 8]]],
                ['id' => 81, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [4, 5, 6, 7, 8, 9]]],
                ['id' => 82, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 83, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15]]],
                ['id' => 84, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => [15, 16]]],
                ['id' => 85, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 86, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => [6]]],
                ['id' => 87, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [8, 9, 10, 11, 12]]],
                ['id' => 88, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => [14, 15]]],
                ['id' => 89, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => [3, 4]]],
                ['id' => 90, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 91, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 92, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);

        // reservation should now also be there for show 2
        $seatingShow2 = $this->client->get('api/v1/concerts/2/shows/2/seating');
        $this->assertJsonResponseEqualsIgnoringOrder($seatingShow2, [
            'rows' => [
                ['id' => 51, 'name' => 'A', 'seats' => ['total' => 15, 'unavailable' => [7]]],
                ['id' => 52, 'name' => 'B', 'seats' => ['total' => 16, 'unavailable' => [9, 10]]],
                ['id' => 53, 'name' => 'C', 'seats' => ['total' => 15, 'unavailable' => [8, 9]]],
                ['id' => 54, 'name' => 'D', 'seats' => ['total' => 16, 'unavailable' => [7, 8, 9, 10]]],
                ['id' => 55, 'name' => 'E', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 56, 'name' => 'F', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 57, 'name' => 'G', 'seats' => ['total' => 15, 'unavailable' => [6, 7, 8, 9, 10, 11]]],
                ['id' => 58, 'name' => 'H', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 59, 'name' => 'I', 'seats' => ['total' => 15, 'unavailable' => [2]]],
                ['id' => 60, 'name' => 'J', 'seats' => ['total' => 16, 'unavailable' => []]],
                ['id' => 61, 'name' => 'K', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 62, 'name' => 'L', 'seats' => ['total' => 16, 'unavailable' => [13, 14, 15, 16]]],
                ['id' => 63, 'name' => 'M', 'seats' => ['total' => 15, 'unavailable' => []]],
                ['id' => 64, 'name' => 'N', 'seats' => ['total' => 16, 'unavailable' => []]],
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationValidationDurations()
    {
        // test duration < 1
        $resSmallDuration = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 81,
                        'seat' => 1,
                    ],
                ],
                'duration' => 0,
            ],
        ]);

        $this->assertResponseCode($resSmallDuration, 422);
        $this->assertResponseHeaderEquals($resSmallDuration, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resSmallDuration, [
            'error' => 'Validation failed',
            'fields' => [
                'duration' => 'The duration must be between 1 and 300.',
            ],
        ]);

        // test duration > 300
        $resLargeDuration = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 81,
                        'seat' => 1,
                    ],
                ],
                'duration' => 301,
            ],
        ]);

        $this->assertResponseCode($resLargeDuration, 422);
        $this->assertResponseHeaderEquals($resLargeDuration, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resLargeDuration, [
            'error' => 'Validation failed',
            'fields' => [
                'duration' => 'The duration must be between 1 and 300.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationValidationReservations()
    {
        // test missing reservations
        $resMissingReservations = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [],
        ]);

        $this->assertResponseCode($resMissingReservations, 422);
        $this->assertResponseHeaderEquals($resMissingReservations, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resMissingReservations, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'The reservations field is required.',
            ],
        ]);

        // test seat number < 1
        $resSmallSeat = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 81,
                        'seat' => 0,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resSmallSeat, 422);
        $this->assertResponseHeaderEquals($resSmallSeat, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resSmallSeat, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 0 in row 81 is invalid.',
            ],
        ]);

        // test seat number > number of seats in row
        $resLargeSeat = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 81,
                        'seat' => 16,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resLargeSeat, 422);
        $this->assertResponseHeaderEquals($resLargeSeat, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resLargeSeat, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 16 in row 81 is invalid.',
            ],
        ]);

        // test inexistent row
        $resInexistentRow = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 181,
                        'seat' => 1,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resInexistentRow, 422);
        $this->assertResponseHeaderEquals($resInexistentRow, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resInexistentRow, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 1 in row 181 is invalid.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationValidationRowFromDifferentShow()
    {
        // test row from other show
        $resOtherShowRow = $this->client->post('api/v1/concerts/2/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 53,
                        'seat' => 10,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($resOtherShowRow, 422);
        $this->assertResponseHeaderEquals($resOtherShowRow, 'Content-Type', 'application/json');
        $this->assertJsonResponseStrictEquals($resOtherShowRow, [
            'error' => 'Validation failed',
            'fields' => [
                'reservations' => 'Seat 10 in row 53 is invalid.',
            ],
        ]);
    }

    /**
     * @medium
     */
    public function testReservationConcertDoesNotExist()
    {
        $res = $this->client->post('api/v1/concerts/20/shows/4/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 84,
                        'seat' => 1,
                    ],
                ],
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
    public function testReservationShowDoesNotExist()
    {
        $res = $this->client->post('api/v1/concerts/2/shows/40/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 84,
                        'seat' => 1,
                    ],
                ],
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
    public function testReservationShowDoesNotBelongToConcert()
    {
        $res = $this->client->post('api/v1/concerts/2/shows/1/reservation', [
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'reservations' => [
                    [
                        'row' => 84,
                        'seat' => 1,
                    ],
                ],
            ],
        ]);

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }
}
