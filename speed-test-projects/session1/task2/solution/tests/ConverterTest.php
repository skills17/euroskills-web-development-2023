<?php

namespace EuroSkills\Trade17\Converter\Tests;

use EuroSkills\Trade17\Converter\Converter;
use Skills17\PHPUnit\BaseTest;

class ConverterTest extends BaseTest
{
    /**
     * @medium
     */
    public function testCsvToJsonConverter()
    {
        $csv =  "year,location,name\n".
                "2021,Graz,EuroSkills 2020\n".
                "2018,Budapest,EuroSkills 2018\n".
                "2016,Gothenburg,EuroSkills 2016\n".
                "2014,Lille,EuroSkills 2014\n";

        $converter = new Converter();
        $json = json_decode($converter->csvToJson($csv), true);

        $this->assertEquals([
            [
                'year' => '2021',
                'location' => 'Graz',
                'name' => 'EuroSkills 2020',
            ],
            [
                'year' => '2018',
                'location' => 'Budapest',
                'name' => 'EuroSkills 2018',
            ],
            [
                'year' => '2016',
                'location' => 'Gothenburg',
                'name' => 'EuroSkills 2016',
            ],
            [
                'year' => '2014',
                'location' => 'Lille',
                'name' => 'EuroSkills 2014',
            ],
        ], $json);
    }
}
