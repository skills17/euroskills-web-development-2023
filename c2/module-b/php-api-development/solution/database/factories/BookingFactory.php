<?php

namespace Database\Factories;

use App\Models\Booking;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Booking::class;

    /**
     * Configure the factory.
     *
     * @return $this
     */
    public function configure()
    {
        $this->faker->seed(3);

        return parent::configure();
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $enFaker = FakerFactory::create('en_US');

        $countryId = $this->faker->biasedNumberBetween(0, 3);
        $country = $countryId < 3 ? 'Austria' : $enFaker->country();

        if ($country === 'Austria') {
            return [
                'name' => $this->faker->firstName().' '.$this->faker->lastName(),
                'address' => $this->faker->streetAddress(),
                'city' => $this->faker->city(),
                'zip' => $this->faker->postcode(),
                'country' => $country,
                'created_at' => $this->faker->dateTimeBetween('2021-01-01 00:00:00', '2021-09-15 00:00:00'),
            ];
        }

        return [
            'name' => $enFaker->firstName().' '.$enFaker->lastName(),
            'address' => $enFaker->streetAddress(),
            'city' => $enFaker->city(),
            'zip' => $enFaker->numberBetween(1000, 99999),
            'country' => $country,
            'created_at' => $enFaker->dateTimeBetween('2021-01-01 00:00:00', '2021-09-15 00:00:00'),
        ];
    }
}
