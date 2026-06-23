<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        return [
            'name' => $name,
            'username' => Str::slug($name) . fake()->numberBetween(1, 999),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'bio' => fake()->paragraph(),
            'major' => fake()->word(),
            'school' => fake()->word() . ' High School',
            'affiliation' => fake()->company(),
            'country' => fake()->country(),
            'academic_title' => fake()->randomElement(['PhD Candidate', 'Professor', 'Student', 'Researcher']),
            'research_interests' => [fake()->word(), fake()->word(), fake()->word()],
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/' . fake()->userName(),
                'twitter' => 'https://twitter.com/' . fake()->userName(),
            ],
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
