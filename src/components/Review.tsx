import { Check, Star } from "lucide-react"

const Review = ({description, author, authorImage}: {
    description: string
    author: string
    authorImage: string
}) => {
    return (
        <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
              <div className="flex gap-0.5 mb-2">
                <Star className="w-5 h-5 text-green-600 fill-green-600"/>
                <Star className="w-5 h-5 text-green-600 fill-green-600"/>
                <Star className="w-5 h-5 text-green-600 fill-green-600"/>
                <Star className="w-5 h-5 text-green-600 fill-green-600"/>
                <Star className="w-5 h-5 text-green-600 fill-green-600"/>
              </div>
              <div className="text-lg leading-8">
                <p>{description}</p>
              </div>

              <div className="flex gap-4 mt-2">
                <img src={authorImage} className="rounded-full h-12 w-12 object-cover" alt="user-1"/>
                <div className="flex flex-col">
                  <p className="font-semibold">{author}</p>
                  <div className="flex gap-1.5 text-zinc-600 items-center">
                    <Check className="h-4 w-4 text-green-600 stroke-[3px]"/>
                    <p className="text-sm">Verified Purchase</p>
                  </div>
                </div>
              </div>
            </div>
    )
}

export default Review;