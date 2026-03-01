import Array "mo:core/Array";
import Map "mo:core/Map";
import Timer "mo:core/Timer";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Post = {
    id : Nat;
    title : Text;
    body : Text;
    tags : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextId = 0;
  let posts = Map.empty<Nat, Post>();

  func comparePostsByDate(a : Post, b : Post) : Order.Order {
    Int.compare(b.createdAt, a.createdAt);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func createPostInternal(title : Text, body : Text, tags : [Text]) : Nat {
    let id = nextId;
    nextId += 1;

    let post : Post = {
      id;
      title;
      body;
      tags;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    posts.add(id, post);
    id;
  };

  public shared ({ caller }) func createPost(title : Text, body : Text, tags : [Text]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };
    createPostInternal(title, body, tags);
  };

  public shared ({ caller }) func updatePost(id : Nat, title : Text, body : Text, tags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existingPost) {
        let updatedPost : Post = {
          existingPost with
          title;
          body;
          tags;
          updatedAt = Time.now();
        };
        posts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };
    if (not posts.containsKey(id)) {
      Runtime.trap("Post not found");
    };
    posts.remove(id);
  };

  public query func getAllPosts() : async [Post] {
    let postsArray = posts.values().toArray();
    postsArray.sort(comparePostsByDate);
  };

  public query func getPost(id : Nat) : async ?Post {
    posts.get(id);
  };

  func seedInitialPosts() : async () {
    if (posts.size() != 0) {
      return;
    };

    ignore createPostInternal(
      "Welcome to My Blog",
      "This is my first post on the Internet Computer. I'm excited to start sharing my thoughts and experiences with you!",
      ["welcome", "introduction"],
    );

    ignore createPostInternal(
      "Building on the Internet Computer",
      "I've been experimenting with Motoko and the Internet Computer. The possibilities are endless!",
      ["development", "motoko", "internet computer"],
    );

    ignore createPostInternal(
      "Thoughts on Decentralization",
      "Decentralization is the future. I'm passionate about building applications that give power back to users.",
      ["decentralization", "web3"],
    );
  };

  ignore Timer.setTimer(#seconds(1), seedInitialPosts);
};
