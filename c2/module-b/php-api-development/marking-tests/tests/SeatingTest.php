<?php

namespace EuroSkills\Trade17\Concerts\Tests;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\ReadTest;

class SeatingTest extends ReadTest
{
    use ResponseAsserts;

    protected $client;

    // /api/v1/concerts/2/shows/4/seating
    protected $expectedSuccessfulResponse = [
        'rows' => [
            [
                'id' => 79,
                'name' => 'A',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 80,
                'name' => 'B',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [2, 3, 4, 5, 6, 7, 8],
                ],
            ],
            [
                'id' => 81,
                'name' => 'C',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [4, 5, 6, 7, 8, 9],
                ],
            ],
            [
                'id' => 82,
                'name' => 'D',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 83,
                'name' => 'E',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [3, 4, 5, 6, 11, 12, 13, 14, 15],
                ],
            ],
            [
                'id' => 84,
                'name' => 'F',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [15, 16],
                ],
            ],
            [
                'id' => 85,
                'name' => 'G',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 86,
                'name' => 'H',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [6],
                ],
            ],
            [
                'id' => 87,
                'name' => 'I',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [8, 9, 10, 11, 12],
                ],
            ],
            [
                'id' => 88,
                'name' => 'J',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [14, 15],
                ],
            ],
            [
                'id' => 89,
                'name' => 'K',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 90,
                'name' => 'L',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 91,
                'name' => 'M',
                'seats' => [
                    'total' => 15,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 92,
                'name' => 'N',
                'seats' => [
                    'total' => 16,
                    'unavailable' => [],
                ],
            ],
        ],
    ];

    public function setUp(): void
    {
        parent::setUp();
        $this->client = new ApiClient();
    }

    /**
     * @medium
     */
    public function testSeating()
    {
        $res = $this->client->get('api/v1/concerts/2/shows/4/seating');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // ignores array orders so wrong sortings will still pass the test
        // additionally, the following gets ignored as well: types and additional properties
        $this->assertJsonResponseEqualsIgnoringOrder($res, $this->expectedSuccessfulResponse);
    }

    /**
     * @medium
     */
    public function testSeatingSortingCorrect()
    {
        $res = $this->client->get('api/v1/concerts/2/shows/4/seating');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // the items in an array have to be in the exact same order
        // additionally, the following gets ignored: types and additional properties
        $this->assertJsonResponseEquals($res, $this->expectedSuccessfulResponse);
    }

    /**
     * @medium
     */
    public function testSeatingStrictEquals()
    {
        $res = $this->client->get('api/v1/concerts/2/shows/4/seating');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // sorting and all types have to be equal to the expected ones
        // additional properties not specified in the API documentation are no longer allowed
        $this->assertJsonResponseStrictEquals($res, $this->expectedSuccessfulResponse);
    }

    /**
     * @medium
     */
    public function testSeatingConcertDoesNotExist()
    {
        $res = $this->client->get('api/v1/concerts/20/shows/4/seating');

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }

    /**
     * @medium
     */
    public function testSeatingShowDoesNotExist()
    {
        $res = $this->client->get('api/v1/concerts/2/shows/40/seating');

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }

    /**
     * @medium
     */
    public function testSeatingShowDoesNotBelongToConcert()
    {
        $res = $this->client->get('api/v1/concerts/2/shows/1/seating');

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }
}
