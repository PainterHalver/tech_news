<?php

namespace Tests\Feature;

use App\Models\View;
use App\Models\Vote;
use App\Traits\TestHelper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PostsTest extends TestCase
{
    use TestHelper;

    public function test_index_get_success(): void
    {
        $response = $this->getJson('/api/posts?sort_by=votes_score&sort_time=week');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'content',
                    'image',
                    'publisher' => [
                        'id',
                        'name',
                        'full_name',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                    'comments_count',
                    'votes_count',
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                '*' => [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);
    }

    public function test_posts_index_should_have_user_vote_if_logged_in(): void
    {
        $user = $this->create_user();
        $response = $this->actingAs($user)->getJson('/api/posts');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'content',
                    'image',
                    'publisher' => [
                        'id',
                        'name',
                        'full_name',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                    'user_vote',
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                '*' => [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);
    }

    public function test_posts_index_should_get_user_bookmarked_success(): void {
        $user = $this->create_user();
        $response = $this->actingAs($user)->getJson('/api/posts?bookmark=1');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'content',
                    'image',
                    'publisher' => [
                        'id',
                        'name',
                        'full_name',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                '*' => [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);
    }

    public function test_posts_index_should_get_user_followed_success(): void
    {
        $user = $this->create_user();
        $response = $this->actingAs($user)->getJson('/api/posts?followed=1');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'content',
                    'image',
                    'publisher' => [
                        'id',
                        'name',
                        'full_name',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                '*' => [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);
    }

    public function test_show_post_success(): void
    {
        $post = $this->create_post();
        $response = $this->getJson('/api/posts/'.$post->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'title',
            'image',
            'publisher' => [
                'id',
                'name',
                'full_name',
                'created_at',
                'updated_at',
            ],
            'created_at',
            'updated_at',
            'comments_count',
            'votes_score',
        ]);
    }

    public function test_show_post_logged_in_success(): void
    {
        $user = $this->create_user();
        $post = $this->create_post();
        $response = $this->actingAs($user)->getJson('/api/posts/'.$post->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'title',
            'image',
            'publisher' => [
                'id',
                'name',
                'full_name',
                'created_at',
                'updated_at',
            ],
            'created_at',
            'updated_at',
            'comments_count',
            'votes_score',
            'user_vote',
            'user_bookmarked',
        ]);
    }

    public function test_vote_post_success(): void
    {
        $user = $this->create_user();
        $post = $this->create_post();
        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/votes', [
            'value' => 1,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'value',
        ]);
    }

    public function test_vote_post_already_exist_success(): void
    {
        $user = $this->create_user();
        $post = $this->create_post();
        $vote = Vote::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
            'value' => 1,
        ]);

        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/votes', [
            'value' => 1,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'value',
        ]);
    }

    public function test_comment_on_post_success(): void
    {
        $user = $this->create_user();
        $post = $this->create_post();
        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/comments', [
            'content' => 'test comment',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'content',
            'created_at',
            'updated_at',
            'user' => [
                'id',
                'username',
                'full_name',
                'avatar',
                'created_at',
                'updated_at',
            ],
        ]);
    }

    public function test_get_post_comments_success(): void
    {
        $post = $this->create_post();
        $response = $this->getJson('/api/posts/'.$post->id.'/comments');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'content',
                    'created_at',
                    'updated_at',
                    'user' => [
                        'id',
                        'username',
                        'full_name',
                        'avatar',
                        'created_at',
                        'updated_at',
                    ],
                ],
            ],
            'first_page_url',
            'from',
            'last_page',
            'last_page_url',
            'links' => [
                '*' => [
                    'url',
                    'label',
                    'active',
                ],
            ],
            'next_page_url',
            'path',
            'per_page',
            'prev_page_url',
            'to',
            'total',
        ]);
    }

    public function test_toggle_bookmark_success(): void
    {
        $user = $this->create_user();
        $post = $this->create_post();
        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/bookmarks');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'bookmarked',
            ],
        ]);

        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/bookmarks');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'bookmarked',
            ],
        ]);
    }

    public function test_add_post_view_success(): void
    {
        $post = $this->create_post();
        $user = $this->create_user();
        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/views');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'post_id',
            'created_at',
            'updated_at',
        ]);

        $response = $this->actingAs($user)->postJson('/api/posts/'.$post->id.'/views');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'post_id',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_get_view_history_success(): void
    {
        $user = $this->create_user();
        $response = $this->actingAs($user)->getJson('/api/posts/history');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'post' => [
                    'id',
                    'title',
                    'content',
                    'image',
                    'publisher' => [
                        'id',
                        'name',
                        'full_name',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                ],
                'created_at',
                'updated_at',
            ],
        ]);
    }

    public function test_admin_update_post_success(): void
    {
        $admin = $this->create_admin();
        $post = $this->create_post();
        $response = $this->actingAs($admin)->patchJson('/api/posts/'.$post->id, [
            'title' => 'new title',
            'description' => 'new content',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'post' => [
                    'id',
                    'title',
                    'image',
                    'publisher' => [
                        'id',
                        'name',
                        'full_name',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }

    public function test_admin_delete_post_success(): void
    {
        $admin = $this->create_admin();
        $post = $this->create_post();
        $response = $this->actingAs($admin)->deleteJson('/api/posts/'.$post->id);

        $response->assertStatus(204);
    }

    public function test_post_recommend_success(): void
    {
        $post1 = $this->create_post();
        $post2 = $this->create_post();
        $user1 = $this->create_user();
        $user2 = $this->create_user();
        $view1 = $post1->views()->create([
            'user_id' => $user1->id,
        ]);
        $view2 = $post2->views()->create([
            'user_id' => $user2->id,
        ]);
        $view3 = $post2->views()->create([
            'user_id' => $user1->id,
        ]);

        // User 2 calls recommend api should see post 1
        $response = $this->actingAs($user2)->getJson('/api/posts/'.$post2->id.'/recommend');
        $response->assertStatus(200);

        // should see post 1 post_id in data array as the first element
        $response->assertJsonFragment([
            'post_id' => $post1->id,
        ]);
    }
}
