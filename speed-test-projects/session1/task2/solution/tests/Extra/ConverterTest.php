<?php

namespace EuroSkills\Trade17\Converter\Tests\Extra;

use EuroSkills\Trade17\Converter\Converter;
use Skills17\PHPUnit\BaseTest;

class ConverterTest extends BaseTest
{
    /**
     * @medium
     */
    public function testCsvToJsonConverter()
    {
        $csv =  "id,language,posts\n".
                "1,javascript,2255740\n".
                "2,php,1411524\n".
                "3,python,1775972\n".
                "4,java,1793352\n".
                "5,go,55480\n";

        $converter = new Converter();
        $json = json_decode($converter->csvToJson($csv), true);

        $this->assertEquals([
            [
                'id' => '1',
                'language' => 'javascript',
                'posts' => '2255740',
            ],
            [
                'id' => '2',
                'language' => 'php',
                'posts' => '1411524',
            ],
            [
                'id' => '3',
                'language' => 'python',
                'posts' => '1775972',
            ],
            [
                'id' => '4',
                'language' => 'java',
                'posts' => '1793352',
            ],
            [
                'id' => '5',
                'language' => 'go',
                'posts' => '55480',
            ],
        ], $json);
    }
}
