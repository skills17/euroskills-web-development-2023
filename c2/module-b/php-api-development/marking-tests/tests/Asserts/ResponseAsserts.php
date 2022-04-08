<?php

namespace EuroSkills\Trade17\Concerts\Tests\Asserts;

use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\ExpectationFailedException;
use JsonException;

trait ResponseAsserts
{
    protected function decodeJsonResponse(Response $res): mixed
    {
        try {
            $json = json_decode($res->getBody(), true, 512, JSON_THROW_ON_ERROR);
            return $json;
        } catch (JsonException $e) {
            throw new ExpectationFailedException("Unable to parse response as JSON.\nResponse:\n".substr($res->getBody(), 0, 1000));
        }
    }

    /**
     * Assert that the response code equals the expected one.
     */
    public function assertResponseCode(Response $res, int $statusCode): void
    {
        $actualStatusCode = $res->getStatusCode();
        $this->assertEquals(
            $statusCode,
            $actualStatusCode,
            'Expected HTTP status code to equal '.$statusCode.' but received '.$actualStatusCode.'.'
        );
    }

    /**
     * Assert if status code is one of the expected ones
     */
    public function assertResponseCodes(Response $res, array $expected)
    {
        $actual = $res->getStatusCode();
        $this->assertEquals(
            true,
            in_array($actual, $expected),
            'Expected HTTP status code to be one of '.implode(', ', $expected).' but received '.$actual.'.'
        );
    }

    /**
     * Assert that a given header exists and equals the expected value.
     */
    public function assertResponseHeaderEquals(Response $res, string $headerName, string $headerValue): void
    {
        $actualHeaderValue = $res->getHeader($headerName);
        $this->assertTrue($res->hasHeader($headerName), 'Response does not contain expected header \''.$headerName.'\'.');
        $this->assertContainsEquals(
            $headerValue,
            $actualHeaderValue,
            'Response header \''.$headerName.'\' does not equal expected value \''.$headerValue.'\'. Received: \''.implode('\', \'', $actualHeaderValue).'\'.'
        );
    }

    /**
     * Assert that a given JSON response equals the expected one.
     */
    public function assertJsonResponseEquals(Response $res, $expected, array $options = []): void
    {
        $this->assertJsonEquals($this->decodeJsonResponse($res), $expected, $options);
    }

    /**
     * Assert that a given JSON response strictly equals the expected one.
     * This includes the correct types and no additional key can be present.
     */
    public function assertJsonResponseStrictEquals(Response $res, $expected, array $options = []): void
    {
        $this->assertJsonStrictEquals($this->decodeJsonResponse($res), $expected, $options);
    }

    /**
     * Assert that a given JSON response strictly equals the expected one.
     * The order of items within arrays will be ignored.
     */
    public function assertJsonResponseEqualsIgnoringOrder(Response $res, $expected, array $options = []): void
    {
        $this->assertJsonEqualsIgnoringOrder($this->decodeJsonResponse($res), $expected, $options);
    }

    /**
     * Assert that a given JSON equals the expected one.
     */
    public function assertJsonEquals($actual, $expected, array $options = []): void
    {
        $diffAst = $this->buildJsonDiffAst($actual, $expected, null, array_merge([
            'strict' => false,
            'strictDates' => false,
            'order' => true,
        ], $options));

        if ($diffAst['fail']) {
            $diff = $this->printJsonDiffAst($diffAst, 0);
            $type = $diffAst['type'] === 'assoc' ? 'objects' : ($diffAst['type'] === 'seq' ? 'arrays' : 'values');
            throw new ExpectationFailedException("Failed asserting that two JSON $type are equal.\n--- Expected\n+++ Actual\n@@ @@\n ".$diff);
        }
    }

    /**
     * Assert that a given JSON strictly equals the expected one.
     * This includes the correct types and no additional key can be present.
     */
    public function assertJsonStrictEquals($actual, $expected, array $options = []): void
    {
        $this->assertJsonEquals($actual, $expected, array_merge($options, ['strict' => true]));
    }

    /**
     * Assert that a given JSON strictly equals the expected one.
     * The order of items within arrays will be ignored.
     */
    public function assertJsonEqualsIgnoringOrder($actual, $expected, array $options = []): void
    {
        $this->assertJsonEquals($actual, $expected, array_merge($options, ['order' => false]));
    }

    /**
     * Builds a diff ast.
     */
    private function buildJsonDiffAst($actual, $expected, $parentKey, array $options): array
    {
        // compare two arrays/objects
        if (is_array($expected)) {
            if (is_array($actual)) {
                // check if actual and expected do not have the same type (array or object)
                if ($this->isAssoc($expected) !== $this->isAssoc($actual)) {
                    return [
                        'fail' => true,
                        'type' => 'value',
                        'key' => $parentKey,
                        'item' => $actual,
                        'expected' => $expected,
                    ];
                }

                $fail = false;
                $diffs = [];

                // merge all keys from actual and expected
                $keys = $this->getItemKeys($actual, $expected, $options);

                foreach ($keys as $key) {
                    $diff = [];
                    $actualKey = $key['actual'];
                    $expectedKey = $key['expected'];

                    if (isset($actual[$actualKey]) && isset($expected[$expectedKey])) {
                        // key exists in actual and expected, compare children
                        $diff = $this->buildJsonDiffAst($actual[$actualKey], $expected[$expectedKey], $expectedKey, $options);
                    } else if (!isset($actual[$actualKey])) {
                        // key exists in expected but not actual
                        $diff = [
                            'fail' => true,
                            'type' => 'value',
                            'key' => $expectedKey,
                            'expected' => $expected[$expectedKey],
                        ];
                    } else if (!isset($expected[$expectedKey])) {
                        // key exists in actual but not expected
                        // if strict mode is not active, ignore the additional key
                        if ($options['strict'] === false && $this->isAssoc($expected)) {
                            continue;
                        }

                        $diff = [
                            'fail' => true,
                            'type' => 'value',
                            'key' => $actualKey,
                            'item' => $actual[$actualKey],
                        ];
                    }

                    $diffs[] = $diff;

                    if ($diff['fail']) {
                        $fail = true;
                    }
                }

                // return result of array/object comparison
                return [
                    'fail' => $fail,
                    'type' => $this->isAssoc($expected) ? 'assoc' : 'seq',
                    'key' => $parentKey,
                    'item' => $diffs,
                ];
            } else {
                // return result if actual is not an array/object but expected is
                return [
                    'fail' => true,
                    'type' => 'value',
                    'key' => $parentKey,
                    'item' => $actual,
                    'expected' => $expected,
                ];
            }
        } else if (is_array($actual)) {
            // return result if actual is an array/object but expected is not
            return [
                'fail' => true,
                'type' => 'value',
                'key' => $parentKey,
                'item' => $actual,
                'expected' => $expected,
            ];
        }

        // compare two dates if strictDates is false
        // in this case, they only have to be in the ISO 8601 format and resolve to the same timestamp
        if ($options['strictDates'] === false && is_string($expected) && is_string($actual)) {
            $expectedDate = $this->isIso8601Date($expected);
            if ($expectedDate['iso8601']) {
                $actualDate = $this->isIso8601Date($actual);

                // both (actual and expected) either have to contain a time or not
                if (!$actualDate['iso8601'] || $expectedDate['time'] !== $actualDate['time']) {
                    return [
                        'fail' => true,
                        'type' => 'value',
                        'key' => $parentKey,
                        'item' => $actual,
                        'expected' => $expected,
                    ];
                }

                // if not in strict mode, ignore wrong dates as long as they have the correct format
                if (!$options['strict']) {
                    return [
                        'fail' => false,
                        'type' => 'value',
                        'key' => $parentKey,
                        'item' => $actual,
                        'expected' => $expected,
                    ];
                }

                return [
                    'fail' => strtotime($expected) !== strtotime($actual),
                    'type' => 'value',
                    'key' => $parentKey,
                    'item' => $actual,
                    'expected' => $expected,
                ];
            }
        }

        // compare two single values (no arrays/objects)
        return [
            'fail' => $options['strict'] ? $actual !== $expected : $actual != $expected,
            'type' => 'value',
            'key' => $parentKey,
            'item' => $actual,
            'expected' => $expected,
        ];
    }

    /**
     * If order should be ignored and two arrays are compared, try to match the same children and
     * return the keys within the actual and expected.
     * Otherwise, return the combined keys from actual and expected.
     */
    private function getItemKeys($actual, $expected, array $options): array
    {
        $keys = [];

        // keys have to equal in actual and expected
        if ($this->isAssoc($actual) || $options['order'] === true) {
            $processedKeys = [];

            foreach (array_keys($expected) as $key) {
                if (!in_array($key, $processedKeys)) {
                    $processedKeys[] = $key;
                    $keys[] = ['actual' => $key, 'expected' => $key];
                }
            }
            foreach (array_keys($actual) as $key) {
                if (!in_array($key, $processedKeys)) {
                    $processedKeys[] = $key;
                    $keys[] = ['actual' => $key, 'expected' => $key];
                }
            }
        // if order does not have to equal for arrays, try to map them correctly
        } else {
            $actualKeys = array_keys($actual);

            foreach (array_keys($expected) as $key) {
                // try to match all items in actual
                foreach ($actualKeys as $actualKey) {
                    $diffAst = $this->buildJsonDiffAst($actual[$actualKey], $expected[$key], null, $options);
                    if ($diffAst['fail'] === false) {
                        array_splice($actualKeys, array_search($actualKey, $actualKeys), 1);
                        $keys[] = ['actual' => $actualKey, 'expected' => $key];
                        continue 2;
                    }
                }

                // children is an object containing an 'id' key, try to match that one
                if (is_array($expected[$key]) && $this->isAssoc($expected[$key]) && isset($expected[$key]['id'])) {
                    foreach ($actualKeys as $actualKey) {
                        if (is_array($actual[$actualKey]) && $this->isAssoc($actual[$actualKey]) && isset($actual[$actualKey]['id'])) {
                            if (($options['strict'] === true && $expected[$key]['id'] === $actual[$actualKey]['id']) ||
                                ($options['strict'] === false && $expected[$key]['id'] == $actual[$actualKey]['id'])) {
                                array_splice($actualKeys, array_search($actualKey, $actualKeys), 1);
                                $keys[] = ['actual' => $actualKey, 'expected' => $key];
                                continue 2;
                            }
                        }
                    }
                }

                // fall back to the next key
                if (count($actualKeys) > 0) {
                    $actualKey = array_shift($actualKeys);
                    $keys[] = ['actual' => $actualKey, 'expected' => $key];
                } else {
                    $keys[] = ['actual' => '__inexistent', 'expected' => $key];
                }
            }

            // add remaining actual keys
            foreach ($actualKeys as $key) {
                $keys[] = ['actual' => $key, 'expected' => '__inexistent'];
            }
        }

        return $keys;
    }

    /**
     * Checks whether a given value is a ISO 8601 Date and if it also contains a time.
     */
    private function isIso8601Date(string $date): array
    {
        // regex from https://www.myintervals.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
        $regex = '/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))(?P<time>[T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/';
        $matches = [];

        if (preg_match($regex, $date, $matches)) {
            return [
                'iso8601' => true,
                'time' => isset($matches['time']) && is_string($matches['time']) && strlen($matches['time']),
            ];
        }

        return [
            'iso8601' => false,
            'time' => false,
        ];
    }

    /**
     * Converts a diff ast to a string.
     */
    private function printJsonDiffAst($diffAst, $depth, $parentType = null, bool $isLast = true): string
    {
        $key = $parentType !== 'seq' && $parentType !== null ? json_encode($diffAst['key']).': ' : '';

        // convert single values
        if ($diffAst['type'] === 'value') {
            $actual = isset($diffAst['item']) ? json_encode($diffAst['item'], JSON_UNESCAPED_UNICODE) : null;
            $expected = isset($diffAst['expected']) ? json_encode($diffAst['expected'], JSON_UNESCAPED_UNICODE) : null;
            $end = $isLast ? '' : ', ';

            if (!$diffAst['fail']) {
                // values equal
                return $this->newLine($depth).$key.$actual.$end;
            } else if (isset($diffAst['item']) && isset($diffAst['expected'])) {
                // values do not equal but were both provided
                return $this->newLine($depth, '-').$key.$expected.$end.
                       $this->newLine($depth, '+').$key.$actual.$end;
            } else if (isset($diffAst['item'])) {
                // only actual was provided but no expected
                return $this->newLine($depth, '+').$key.$actual.$end;
            } else {
                // only expected was provided but no actual
                return $this->newLine($depth, '-').$key.$expected.$end;
            }
        }

        // convert arrays/objects
        $open = $diffAst['type'] === 'assoc' ? '{' : '[';
        $close = ($diffAst['type'] === 'assoc' ? '}' : ']').($isLast ? '' : ', ');

        if (!$diffAst['fail']) {
            return $this->newLine($depth).$key.$open.' ... '.$close;
        }

        $out = '';

        if ($diffAst['key'] !== null) {
            $out .= $this->newLine($depth).$key;
        }

        $out .= $open;

        // recursively convert children
        foreach ($diffAst['item'] as $i => $item) {
            $out .= $this->printJsonDiffAst($item, $depth + 1, $diffAst['type'], array_key_last($diffAst['item']) === $i);
        }

        $out .= $this->newLine($depth).$close;

        return $out;
    }

    /**
     * Checks whether an array is associative or sequential
     */
    private function isAssoc(array $arr): bool
    {
        if (array() === $arr) return false;
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    /**
     * Add a new padded new line
     */
    private function newLine(int $depth, string $prefix = ''): string
    {
        return "\n".$prefix.str_pad(' ', (1 - strlen($prefix)) + $depth * 4);
    }
}
