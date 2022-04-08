<?php

namespace EuroSkills\Trade17\Validator\Tests\Extra;

use EuroSkills\Trade17\Validator\Validator;
use Skills17\PHPUnit\BaseTest;

class ValidatorTest extends BaseTest
{
    /**
     * @medium
     */
    public function testValidationStartsWithCaseInsensitive()
    {
        $validator = new Validator();

        $this->assertFalse($validator->startsWithCaseInsensitive('something', 'semo'));
        $this->assertFalse($validator->startsWithCaseInsensitive('.', 'test'));

        $this->assertTrue($validator->startsWithCaseInsensitive('something', 'some'));
        $this->assertTrue($validator->startsWithCaseInsensitive('something', 'somethi'));
        $this->assertTrue($validator->startsWithCaseInsensitive('sOmEtHiNg', 'SOMEthi'));
    }

    /**
     * @medium
     */
    public function testValidationBetween()
    {
        $validator = new Validator();

        $this->assertFalse($validator->between(41, 42, 43));
        $this->assertFalse($validator->between('something', 10, 11));
        $this->assertFalse($validator->between(41, 39, 40));
        $this->assertFalse($validator->between('something', 0, 5));
        $this->assertFalse($validator->between('something', 0, 8));

        $this->assertTrue($validator->between(41, 0, 100));
        $this->assertTrue($validator->between('something', 5, 15));
        $this->assertTrue($validator->between(41, 41, 42));
        $this->assertTrue($validator->between('something', 9, 40));
        $this->assertTrue($validator->between(41, 40, 41));
        $this->assertTrue($validator->between('foo', 2, 4));
    }

    /**
     * @medium
     */
    public function testValidationDateAfter()
    {
        $validator = new Validator();

        $this->assertFalse($validator->dateAfter('2000-05-05', '2000-05-06'));
        $this->assertFalse($validator->dateAfter('foobar', '2021-10-25'));
        $this->assertFalse($validator->dateAfter('nope', '2006-01-01'));
        $this->assertFalse($validator->dateAfter('2021-11-10', '2021-11-11'));

        $this->assertTrue($validator->dateAfter('2000-05-05', '2000-05-04'));
    }
}
