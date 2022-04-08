<?php

namespace EuroSkills\Trade17\Concerts\Tests\Extra;

use EuroSkills\Trade17\Concerts\Tests\Asserts\ResponseAsserts;
use EuroSkills\Trade17\Concerts\Tests\Clients\ApiClient;
use Skills17\PHPUnit\Database\WriteTest;

class ConcertListingTest extends WriteTest
{
    use ResponseAsserts;

    protected $client;

    // /api/v1/concerts
    protected $expectedSuccessfulResponse = [
        'concerts' => [
            [
                'id' => 1,
                'artist' => 'Abba',
                'location' => [
                    'id' => 1,
                    'name' => 'Oper Graz',
                ],
                'shows' => [
                    [
                        'id' => 5,
                        'start' => '2021-09-30T17:00:00Z',
                        'end' => '2021-09-30T19:00:00Z',
                    ],
                    [
                        'id' => 1,
                        'start' => '2021-10-02T19:00:00Z',
                        'end' => '2021-10-02T22:00:00Z',
                    ],
                ],
            ],
            [
                'id' => 2,
                'artist' => 'Bilderbuch',
                'location' => [
                    'id' => 3,
                    'name' => 'Das Orpheum',
                ],
                'shows' => [
                    [
                        'id' => 2,
                        'start' => '2021-09-29T18:15:00Z',
                        'end' => '2021-09-29T19:30:00Z',
                    ],
                    [
                        'id' => 4,
                        'start' => '2021-09-30T20:30:00Z',
                        'end' => '2021-09-30T22:30:00Z',
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
                'id' => 3,
                'artist' => 'Wanda',
                'location' => [
                    'id' => 2,
                    'name' => 'Freilufthalle B',
                ],
                'shows' => [
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

        // modify database
        $this->db->exec('UPDATE `concerts` SET artist = "Abba" WHERE id = 1');
        $this->db->exec('UPDATE `shows` SET concert_id = 1 WHERE id = 5');
        $this->db->exec('UPDATE `shows` SET start = "2021-09-29 20:15:00", end = "2021-09-29 21:30:00" WHERE id = 2');
    }

    /**
     * @medium
     */
    public function testConcertListingAll()
    {
        $res = $this->client->get('api/v1/concerts');

        $this->assertResponseCode($res, 200);
        $this->assertResponseHeaderEquals($res, 'Content-Type', 'application/json');

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

        $this->assertJsonResponseStrictEquals($res, $this->expectedSuccessfulResponse);
    }
}
