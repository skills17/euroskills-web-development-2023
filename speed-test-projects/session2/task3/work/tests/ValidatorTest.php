<?php

namespace EuroSkills\Trade17\Validator\Tests;

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

        $this->assertTrue($validator->startsWithCaseInsensitive('EuroSkills', 'Euro'));
        $this->assertTrue($validator->startsWithCaseInsensitive('euroskills', 'Euro'));
        $this->assertTrue($validator->startsWithCaseInsensitive('EuroSkills', 'euro'));
        $this->assertTrue($validator->startsWithCaseInsensitive('Euro', 'Euro'));
        $this->assertTrue($validator->startsWithCaseInsensitive('foobarbaz', 'f'));

        $this->assertFalse($validator->startsWithCaseInsensitive('EuroSkills', 'Skills'));
        $this->assertFalse($validator->startsWithCaseInsensitive('foo', 'Euro'));
        $this->assertFalse($validator->startsWithCaseInsensitive('f', 'foobarbaz'));
    }

    /**
     * @medium
     */
    public function testValidationBetween()
    {
        $validator = new Validator();

        $this->assertTrue($validator->between(4, 3, 5));
        $this->assertTrue($validator->between(3, 3, 5));
        $this->assertTrue($validator->between(5, 3, 5));
        $this->assertTrue($validator->between('foo', 2, 4));
        $this->assertTrue($validator->between('fo', 2, 4));
        $this->assertTrue($validator->between('fooo', 2, 4));

        $this->assertFalse($validator->between(4, 5, 10));
        $this->assertFalse($validator->between(3, 0, 2));
        $this->assertFalse($validator->between('foo', 4, 8));
        $this->assertFalse($validator->between('foo', 1, 2));
    }

    /**
     * @medium
     */
    public function testValidationDateAfter()
    {
        $validator = new Validator();

        $this->assertTrue($validator->dateAfter('2021-09-28', '2021-09-20'));
        $this->assertTrue($validator->dateAfter('2021-10-25', '2021-01-05'));
        $this->assertTrue($validator->dateAfter('2006-01-01', '2004-11-10'));

        $this->assertFalse($validator->dateAfter('2021-09-20', '2021-09-28'));
        $this->assertFalse($validator->dateAfter('2021-01-05', '2021-10-25'));
        $this->assertFalse($validator->dateAfter('2004-11-10', '2006-01-01'));
        $this->assertFalse($validator->dateAfter('invaliddate', '2004-11-10'));
        $this->assertFalse($validator->dateAfter('2021-09-28', '2021-09-28'));
    }
}
