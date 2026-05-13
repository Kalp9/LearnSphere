import { CheckCircle2, PlayCircle, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { formatCurrency, formatDate } from "../utils/format";
import { mediaUrl } from "../utils/media";
import { loadRazorpay } from "../utils/razorpay";

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [buying, setBuying] = useState(false);
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.course);
        setIsEnrolled(data.isEnrolled);
      } catch (error) {
        toast.error(error.message);
        navigate("/courses");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const buyCourse = async () => {
    setBuying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout failed to load");

      const [{ data: keyData }, { data: orderData }] = await Promise.all([
        api.get("/payments/key"),
        api.post("/payments/create-order", { courseId: course._id })
      ]);

      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "LearnSphere",
        description: course.title,
        image: "/favicon.svg",
        order_id: orderData.order.id,
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: "#22d3ee"
        },
        handler: async (response) => {
          await api.post("/payments/verify", {
            ...response,
            courseId: course._id
          });
          toast.success("Payment successful. Course unlocked.");
          setIsEnrolled(true);
          await refreshUser();
        },
        modal: {
          ondismiss: async () => {
            await api.post("/payments/failed", { razorpayOrderId: orderData.order.id }).catch(() => {});
          }
        }
      };

      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", async () => {
        await api.post("/payments/failed", { razorpayOrderId: orderData.order.id }).catch(() => {});
        toast.error("Payment failed");
      });
      checkout.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBuying(false);
    }
  };

  if (!course) return <Spinner label="Loading course" />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950">
            {isEnrolled ? (
              <iframe
                className="aspect-video w-full"
                src={course.videoUrl.replace("watch?v=", "embed/")}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img src={course.thumbnailUrl || mediaUrl(course.thumbnail)} alt={course.title} className="aspect-video w-full object-cover" />
            )}
          </div>
          <div className="mt-8">
            <span className="rounded-full bg-cyan-300/12 px-3 py-1 text-sm font-bold text-cyan-200">{course.category}</span>
            <h1 className="mt-4 text-4xl font-black text-white">{course.title}</h1>
            <p className="mt-4 leading-8 text-slate-300">{course.description}</p>
          </div>
        </div>

        <aside className="glass h-fit rounded-lg p-6">
          <p className="text-4xl font-black text-white">{formatCurrency(course.price)}</p>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <p className="flex items-center gap-3"><UserRound className="h-5 w-5 text-cyan-300" /> Instructor: {course.instructor}</p>
            <p className="flex items-center gap-3"><PlayCircle className="h-5 w-5 text-cyan-300" /> Lifetime access</p>
            <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-cyan-300" /> Created {formatDate(course.createdAt)}</p>
          </div>
          {isEnrolled ? (
            <div className="mt-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-semibold text-emerald-100">
              You own this course. The lesson player is unlocked.
            </div>
          ) : (
            <button disabled={buying} onClick={buyCourse} className="btn-primary mt-6 w-full">
              <ShoppingCart className="h-5 w-5" />
              {buying ? "Opening checkout..." : "Purchase course"}
            </button>
          )}
        </aside>
      </div>
    </section>
  );
};

export default CourseDetails;
