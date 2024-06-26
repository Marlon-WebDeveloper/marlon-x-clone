import React from "react";
import ComposeTweet from "./server-components/ComposeTweet";
import { getTweets, isBookmarked } from '@/lib/supabase/queries';
import Tweet from "./Tweet";
import { createClient } from "@/utils/supabase/server";
import ComposeTweetBtn from "./server-components/ComposeTweetBtn";
import LogoutBtn from "./ui/logout";

const MainComponent = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;
  const res = await getTweets(userId as string);
  


  return (
    <>
      <div className="h-full relative min-h-screen" id="post-input">
        <div className="w-full z-10 border-b-[0.5px] border-gray-600 flex items-center justify-between sticky top-0 backdrop-blur-sm">
          <h1 className="text-xl font-bold p-6 bg-black/10 ">Home</h1>
          <LogoutBtn classname="lg:hidden" />
        </div>
        <div className="border-t-[0.5px] border-b-[0.5px] flex px-4 py-6 items-stretch space-x-2 border-gray-600 relative">
          <div className="w-10 h-10 bg-slate-400 rounded-full flex-none"></div>
          <ComposeTweet />
        </div>
        <div className="flex flex-col">
          {res &&
            res.data?.map(async ({ tweet, profile, likes, hasLiked }) => {
              const isTweetBookmarked = await isBookmarked(
                userId as string,
                tweet.id
              );
              return (
                <Tweet
                  key={tweet.id}
                  tweet={{
                    tweetDetails: { ...tweet },
                    userProfile: { ...profile },
                  }}
                  hasLiked={hasLiked}
                  likesCount={likes.length}
                  currentUser={userId as string}
                  isBookmarked={isTweetBookmarked}
                />
              );
            })}
        </div>
      </div>
      <ComposeTweetBtn />
    </>
  );
};

export default MainComponent;
