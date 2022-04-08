<?php

namespace EuroSkills\Trade17\Concerts\Tests;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\ReadTest;

class ConcertListingTest extends ReadTest
{
    use ResponseAsserts;

    protected $client;

    // /api/v1/concerts
    protected $expectedSuccessfulResponse = [
        'concerts' => [
            [
                'id' => 2,
                'artist' => 'Bilderbuch',
                'location' => [
                    'id' => 3,
                    'name' => 'Das Orpheum',
                ],
                'shows' => [
                    [
                        'id' => 4,
                        'start' => '2021-09-30T20:30:00Z',
                        'end' => '2021-09-30T22:30:00Z',
                    ],
                    [
                        'id' => 2,
                        'start' => '2021-10-01T17:00:00Z',
                        'end' => '2021-10-01T19:00:00Z',
                    ],
                ],
            ],
            [
                'id' => 4,
                'artist' => 'Christina Stürmer',
                'location' => [
                    'id' => 3,
                    'name' => 'Das Orpheum',
                ],
                'shows' => [
                    [
                        'id' => 3,
                        'start' => '2021-10-03T18:00:00Z',
                        'end' => '2021-10-03T21:00:00Z',
                    ],
                ],
            ],
            [
                'id' => 1,
                'artist' => 'Opus',
                'location' => [
                    'id' => 1,
                    'name' => 'Oper Graz',
                ],
                'shows' => [
                    [
                        'id' => 1,
                        'start' => '2021-10-02T19:00:00Z',
                        'end' => '2021-10-02T22:00:00Z',
                    ],
                ],
            ],
            [
                'id' => 3,
                'artist' => 'Wanda',
                'location' => [
                    'id' => 2,
                    'name' => 'Freilufthalle B',
                ],
                'shows' => [
                    [
                        'id' => 5,
                        'start' => '2021-09-30T17:00:00Z',
                        'end' => '2021-09-30T19:00:00Z',
                    ],
                    [
                        'id' => 6,
                        'start' => '2021-10-01T20:30:00Z',
                        'end' => '2021-10-01T22:30:00Z',
                    ],
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
    public function testConcertListingAll()
    {
        $res = $this->client->get('api/v1/concerts');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // ignores array orders so wrong sortings will still pass the test
        // additionally, the following gets ignored as well: types, additional properties and
        // different date formats as long as they are still ISO 8601
        $this->assertJsonResponseEqualsIgnoringOrder($res, $this->expectedSuccessfulResponse);
    }

    /**
     * @medium
     */
    public function testConcertListingAllSortingCorrect()
    {
        $res = $this->client->get('api/v1/concerts');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // the items in an array have to be in the exact same order
        // additionally, the following gets ignored: types, additional properties and
        // different date formats as long as they are still ISO 8601
        $this->assertJsonResponseEquals($res, $this->expectedSuccessfulResponse);
    }

    /**
     * @medium
     */
    public function testConcertListingAllStrictEquals()
    {
        $res = $this->client->get('api/v1/concerts');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

        // sorting and all types have to be equal to the expected ones
        // additional properties not specified in the API documentation are no longer allowed
        // but different date formats will still pass as long as they are still ISO 8601 (e.g. 2021-09-30T20:30:00.000000Z)
        $this->assertJsonResponseStrictEquals($res, $this->expectedSuccessfulResponse);
    }
}
