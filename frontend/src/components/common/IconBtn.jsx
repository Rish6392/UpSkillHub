export default function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
  }) {
    return (
      <button
        disabled={disabled}
        onClick={onclick}
        className={`flex items-center justify-center ${
          outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
        } cursor-pointer gap-x-2 rounded-md py-2 px-3 sm:px-5 font-semibold text-richblack-900 w-full sm:w-auto ${customClasses}`}
        type={type}
      >
        {children ? (
          <>
            <span className={`${outline && !customClasses?.includes('text-') && "text-yellow-50"}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </button>
    )
  }