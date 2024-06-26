"use client";
import NextImage from "next/image";
import PhoneTemplate from "../../../../public/phone-template.png";
import { cn, formatPrice } from "@/lib/utils";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";
import {
  Description,
  Radio,
  RadioGroup,
  Label as RadioLabel,
} from "@headlessui/react";
import { useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/product";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { SaveConfigArgs, saveConfig } from "./action";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ConfigProps {
  configId: string;
  imageUrl: string;
  imageDimension: { width: number; height: number };
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimension,
}: ConfigProps) => {
  const { toast } = useToast();
  const router = useRouter();

  // using react query for saving cropped image to db
  const { mutate: saveAndStoreConfig, isPending } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  // for storing cropped image data made by end user
  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimension.width / 4,
    height: imageDimension.height / 4,
  });

  // for storing cropped image data made by end user
  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  // refs to find the phone case and its associated div container for saving the image configuaration
  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const phoneCaseParentContainerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  async function saveConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        phoneCaseParentContainerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      // evaluating coordinated of the user uploaded image just on the "phone case"
      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      // canvas creation
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      // draw on the canvas
      context?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      // export above canvas data/info
      // 1. convert canvas data to base64
      // 2. convert base64 string to image

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, Please try again.",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-20 mb-20 pb-20 relative">
      <div
        ref={phoneCaseParentContainerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300  p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none z-50 aspect-[896/1831] relative w-full"
          >
            <NextImage
              src={PhoneTemplate}
              alt="phone-template"
              className="pointer-events-none select-none z-50"
              fill
            />
          </AspectRatio>
          <div className="absolute inset-0 z-40 left-[3px] right-[3px] top-px bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px bottom-px right-[3px] rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimension.height / 4,
            width: imageDimension.width / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          // perform the underlying logic below when user has stopped cropping/resizing the image
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              // 50px --> 50
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;

            setRenderedPosition({ x, y });
          }}
          className="absolute z-20 border-[3px] border-primary"
        >
          <div className="w-full h-full relative">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 bg-white flex flex-col">
        <ScrollArea className="flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="font-bold text-3xl tracking-tight">
              Customise your case
            </h2>
            <div className="bg-zinc-200 w-full h-px my-6" />
            <div className="flex flex-col justify-between h-full mt-4 relative">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="space-x-2">
                    {COLORS.map((color) => (
                      <Radio
                        value={color}
                        key={color.label}
                        className={({ checked }) =>
                          cn(
                            "relative inline-flex items-center justify-center -m-0.5 cursor-pointer rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [`border-${color.tw}`]: checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="h-4 w-4 ml-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72">
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-4 h-4 w-4",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          [name]: val,
                        }));
                      }}
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none focus:ring-0 ring-0 outline-none sm:flex sm:justify-between",
                                {
                                  "border-primary": checked,
                                }
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioLabel
                                  className="font-medium text-gray-900"
                                  as="span"
                                >
                                  {option.label}
                                </RadioLabel>

                                {option.description ? (
                                  <Description
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </Description>
                                ) : null}
                              </span>
                            </span>

                            <Description>
                              <span>{formatPrice(option.price / 100)}</span>
                            </Description>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="h-16 w-full bg-white px-8">
          <div className="w-full h-px bg-zinc-200" />
            <div className="flex justify-end items-center w-full h-full">
              <div className="flex items-center w-full gap-6">
                <p className="font-medium whitespace-nowrap">
                  {formatPrice(
                    (BASE_PRICE +
                      options.finish.price +
                      options.material.price) /
                      100
                  )}
                </p>
                <Button
                  isLoading={isPending}
                  disabled={isPending}
                  loadingText="Saving"
                  onClick={() =>
                    saveAndStoreConfig({
                      configId,
                      color: options.color.value,
                      material: options.material.value,
                      finish: options.finish.value,
                      model: options.model.value
                    })
                  }
                  size="sm"
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                </Button>
              </div>  
            </div>
        </div>
      </div>
    </div>
  )
}

export default DesignConfigurator;
