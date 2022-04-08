<?php

namespace EuroSkills\Trade17\Concerts\Tests\Extra;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\ReadTest;

class SeatingTest extends ReadTest
{
    use ResponseAsserts;

    protected $client;

    // /api/v1/concerts/1/shows/1/seating
    protected $expectedSuccessfulResponse = [
        'rows' => [
            [
                'id' => 1,
                'name' => 'Stalls 01',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 2,
                'name' => 'Stalls 02',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [33, 34, 35, 36, 37, 38, 39],
                ],
            ],
            [
                'id' => 3,
                'name' => 'Stalls 03',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 4,
                'name' => 'Stalls 04',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [2, 3, 4, 5, 6],
                ],
            ],
            [
                'id' => 5,
                'name' => 'Stalls 05',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 6,
                'name' => 'Stalls 06',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [14, 15, 16, 17, 31, 32, 33, 34, 35],
                ],
            ],
            [
                'id' => 7,
                'name' => 'Stalls 07',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [29, 30, 31],
                ],
            ],
            [
                'id' => 8,
                'name' => 'Stalls 08',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [17, 18, 19],
                ],
            ],
            [
                'id' => 9,
                'name' => 'Stalls 09',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21],
                ],
            ],
            [
                'id' => 10,
                'name' => 'Stalls 10',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24, 25, 26, 27, 28],
                ],
            ],
            [
                'id' => 11,
                'name' => 'Stalls 11',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 12,
                'name' => 'Stalls 12',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 13,
                'name' => 'Stalls 13',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [16, 17, 18, 19, 20, 21, 22, 24, 25, 36, 37, 38, 39, 40],
                ],
            ],
            [
                'id' => 14,
                'name' => 'Stalls 14',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [2, 3, 4, 5, 6, 7, 8, 9, 32, 33, 34, 35, 36, 37],
                ],
            ],
            [
                'id' => 15,
                'name' => 'Stalls 15',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [37, 38, 39],
                ],
            ],
            [
                'id' => 16,
                'name' => 'Stalls 16',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [6, 7, 8, 9, 26, 27, 28],
                ],
            ],
            [
                'id' => 17,
                'name' => 'Stalls 17',
                'seats' => [
                    'total' => 40,
                    'unavailable' => [28, 29, 30, 31, 32, 33, 34],
                ],
            ],
            [
                'id' => 18,
                'name' => 'Stalls 18',
                'seats' => [
                    'total' => 39,
                    'unavailable' => [11, 12, 13, 14],
                ],
            ],
            [
                'id' => 19,
                'name' => 'Terrace 1',
                'seats' => [
                    'total' => 35,
                    'unavailable' => [],
                ],
            ],
            [
                'id' => 20,
                'name' => 'Terrace 2',
                'seats' => [
                    'total' => 30,
                    'unavailable' => [22, 23, 24, 25, 26, 27, 28, 29],
                ],
            ],
            [
                'id' => 21,
                'name' => 'Terrace 3',
                'seats' => [
                    'total' => 20,
                    'unavailable' => [10, 11, 12],
                ],
            ],
            [
                'id' => 22,
                'name' => 'Terrace 4',
                'seats' => [
                    'total' => 20,
                    'unavailable' => [5, 6, 7, 8, 9, 10],
                ],
            ],
            [
                'id' => 23,
                'name' => 'Terrace 5',
                'seats' => [
                    'total' => 20,
                    'unavailable' => [14, 15, 16, 17, 18, 19, 20],
                ],
            ],
            [
                'id' => 24,
                'name' => 'Terrace 6',
                'seats' => [
                    'total' => 20,
                    'unavailable' => [17, 18, 19, 20],
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
        $res = $this->client->get('api/v1/concerts/1/shows/1/seating');

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
        $res = $this->client->get('api/v1/concerts/1/shows/1/seating');

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
        $res = $this->client->get('api/v1/concerts/1/shows/1/seating');

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
        $res = $this->client->get('api/v1/concerts/10/shows/1/seating');

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
        $res = $this->client->get('api/v1/concerts/1/shows/10/seating');

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
        $res = $this->client->get('api/v1/concerts/1/shows/4/seating');

        $this->assertResponseCode($res, 404);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        $this->assertJsonResponseStrictEquals($res, [
            'error' => 'A concert or show with this ID does not exist',
        ]);
    }
}
