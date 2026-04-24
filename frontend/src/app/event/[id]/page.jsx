"use client"; // ✅ Fixed missing opening quote

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { getUserFromToken, getToken, getAuthHeaders } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users, Check } from "lucide-react";
import { format } from "date-fns";

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push("/sign-in");
        return;
      }

      const userData = getUserFromToken();
      if (!userData) {
        router.push("/sign-in");
        return;
      }

      setUser(userData);
      await fetchEventDetails();
      await checkRSVPStatus(userData.userId);
    };

    if (eventId) {
      checkAuth();
    }
  }, [eventId, router]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/events/view-single-event/${eventId}`,
        { headers: getAuthHeaders() }
      );
      setEvent(response.data.event);
      setError("");
    } catch (err) {
      console.error("Failed to fetch event:", err);
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const checkRSVPStatus = async (userId) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/rsvp/status",
        {
          headers: getAuthHeaders(),
          params: { userId, eventId },
        }
      );
      if (response.data.rsvp) {
        setRsvpStatus(response.data.rsvp);
      }
    } catch (err) {
      console.error("Failed to check RSVP status:", err);
    }
  };

  const handleRSVP = async (response) => {
    if (!user) return;

    try {
      setIsRSVPing(true);
      await axios.post(
        "http://localhost:3000/api/v1/rsvp/create",
        { eventId, response },
        { headers: getAuthHeaders() }
      );

      setSuccess(`You have RSVP'd "${response}" to this event!`);
      await checkRSVPStatus(user.userId);
      setError("");
    } catch (err) {
      console.error("Failed to RSVP:", err);
      setError(err.response?.data?.message || "Failed to RSVP");
      setSuccess("");
    } finally {
      setIsRSVPing(false);
    }
  };

  const handleCancelRSVP = async () => {
    if (!rsvpStatus) return;
    if (!confirm("Are you sure you want to cancel your RSVP?")) return;

    try {
      setIsRSVPing(true);
      await axios.delete(
        `http://localhost:3000/api/v1/rsvp/cancel/${rsvpStatus._id}`,
        { headers: getAuthHeaders() }
      );

      setSuccess("RSVP cancelled successfully!");
      setRsvpStatus(null);
      setError("");
      await fetchEventDetails();
    } catch (err) {
      console.error("Failed to cancel RSVP:", err);
      setError("Failed to cancel RSVP");
      setSuccess("");
    } finally {
      setIsRSVPing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Event not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <Card className="mb-6">
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-t-lg">
            <div className="text-6xl">EVENT</div>
          </div>

          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {format(new Date(event.date), "PPP p")}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold">
                      {event.registrationCount || 0} / {event.capacity} attending
                    </p>
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">About this event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* ✅ Fixed: if statement replaced with && operator */}
            {user && !user.isAdmin && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Your Response</h2>

                {rsvpStatus ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                      <Check className="w-5 h-5" />
                      You have RSVP'd "{rsvpStatus.response}" to this event
                    </div>
                    <Button
                      onClick={handleCancelRSVP}
                      disabled={isRSVPing}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isRSVPing ? "Cancelling..." : "Cancel RSVP"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Will you attend this event?</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleRSVP("Yes")}
                        disabled={isRSVPing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isRSVPing ? "Responding..." : "Yes, I'll attend"}
                      </Button>
                      <Button
                        onClick={() => handleRSVP("No")}
                        disabled={isRSVPing}
                        variant="outline"
                        className="flex-1"
                      >
                        {isRSVPing ? "Responding..." : "No, Can't attend"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}