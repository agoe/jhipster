package com.myapp.web.rest;

import com.myapp.domain.Posts;
import com.myapp.repository.PostsRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Posts}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PostsResource {

    private final Logger log = LoggerFactory.getLogger(PostsResource.class);

    private static final String ENTITY_NAME = "posts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PostsRepository postsRepository;

    public PostsResource(PostsRepository postsRepository) {
        this.postsRepository = postsRepository;
    }

    /**
     * {@code POST  /posts} : Create a new posts.
     *
     * @param posts the posts to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new posts, or with status {@code 400 (Bad Request)} if the posts has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/posts")
    public ResponseEntity<Posts> createPosts(@Valid @RequestBody Posts posts) throws URISyntaxException {
        log.debug("REST request to save Posts : {}", posts);
        if (posts.getId() != null) {
            throw new BadRequestAlertException("A new posts cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Posts result = postsRepository.save(posts);
        return ResponseEntity
            .created(new URI("/api/posts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /posts/:id} : Updates an existing posts.
     *
     * @param id the id of the posts to save.
     * @param posts the posts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated posts,
     * or with status {@code 400 (Bad Request)} if the posts is not valid,
     * or with status {@code 500 (Internal Server Error)} if the posts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/posts/{id}")
    public ResponseEntity<Posts> updatePosts(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Posts posts
    ) throws URISyntaxException {
        log.debug("REST request to update Posts : {}, {}", id, posts);
        if (posts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, posts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!postsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Posts result = postsRepository.save(posts);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, posts.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /posts/:id} : Partial updates given fields of an existing posts, field will ignore if it is null
     *
     * @param id the id of the posts to save.
     * @param posts the posts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated posts,
     * or with status {@code 400 (Bad Request)} if the posts is not valid,
     * or with status {@code 404 (Not Found)} if the posts is not found,
     * or with status {@code 500 (Internal Server Error)} if the posts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/posts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Posts> partialUpdatePosts(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Posts posts
    ) throws URISyntaxException {
        log.debug("REST request to partial update Posts partially : {}, {}", id, posts);
        if (posts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, posts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!postsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Posts> result = postsRepository
            .findById(posts.getId())
            .map(existingPosts -> {
                if (posts.getTitle() != null) {
                    existingPosts.setTitle(posts.getTitle());
                }

                return existingPosts;
            })
            .map(postsRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, posts.getId()));
    }

    /**
     * {@code GET  /posts} : get all the posts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of posts in body.
     */
    @GetMapping("/posts")
    public List<Posts> getAllPosts() {
        log.debug("REST request to get all Posts");
        return postsRepository.findAll();
    }

    /**
     * {@code GET  /posts/:id} : get the "id" posts.
     *
     * @param id the id of the posts to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the posts, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/posts/{id}")
    public ResponseEntity<Posts> getPosts(@PathVariable String id) {
        log.debug("REST request to get Posts : {}", id);
        Optional<Posts> posts = postsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(posts);
    }

    /**
     * {@code DELETE  /posts/:id} : delete the "id" posts.
     *
     * @param id the id of the posts to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePosts(@PathVariable String id) {
        log.debug("REST request to delete Posts : {}", id);
        postsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
