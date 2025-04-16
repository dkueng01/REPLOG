"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Plus, Save, RefreshCw, Info, Timer, Play, Pause, RotateCcw, Trophy, Trash2 } from "lucide-react"
import { exercises } from "@/mockedData/exercises"
import { workoutPlans } from "@/mockedData/workoutPlans"
import { workouts } from "@/mockedData/workouts"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface ExerciseSet {
  weight: number
  reps: number
}

interface ActiveExercise {
  exerciseId: string
  originalExerciseId?: string
  sets: ExerciseSet[]
  earlyRPE?: number
  lastRPE?: number
  restTime?: number
  warmupSets?: number
}

export function ActiveWorkoutPage() {
  const [selectedPlanId, setSelectedPlanId] = useState("")
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([])
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false)
  const [addExerciseDialogOpen, setAddExerciseDialogOpen] = useState(false)
  const [exerciseToReplace, setExerciseToReplace] = useState<number | null>(null)
  const [restTimer, setRestTimer] = useState<{ isActive: boolean; timeLeft: number; exerciseIndex: number | null }>({
    isActive: false,
    timeLeft: 0,
    exerciseIndex: null,
  })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (restTimer.isActive && restTimer.timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setRestTimer((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
    } else if (restTimer.isActive && restTimer.timeLeft === 0) {
      toast({
        title: "Rest complete!",
        description: "Time to start your next set.",
      })
      setRestTimer({ isActive: false, timeLeft: 0, exerciseIndex: null })
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [restTimer])

  const handleSelectPlan = (planId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId)
    if (!plan) return

    const initialExercises = plan.exercises.map((exercise) => {
      const exerciseData = exercises.find((e) => e.id === exercise.exerciseId)
      const lastWeight = exerciseData?.lastWeight || 0

      return {
        exerciseId: exercise.exerciseId,
        sets: Array(exercise.sets)
          .fill(0)
          .map(() => ({
            weight: lastWeight,
            reps: 0,
          })),
        earlyRPE: exercise.earlyRPE,
        lastRPE: exercise.lastRPE,
        restTime: exercise.restTime,
        warmupSets: exercise.warmupSets,
      }
    })

    setActiveExercises(initialExercises)
    setSelectedPlanId(planId)
    setIsWorkoutStarted(true)
  }

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...activeExercises]
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1]
    updatedExercises[exerciseIndex].sets.push({ ...lastSet })
    setActiveExercises(updatedExercises)
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: "weight" | "reps", value: number) => {
    const updatedExercises = [...activeExercises]
    updatedExercises[exerciseIndex].sets[setIndex][field] = value
    setActiveExercises(updatedExercises)
  }

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...activeExercises]

    // Don't remove if it's the only set
    if (updatedExercises[exerciseIndex].sets.length <= 1) {
      toast({
        title: "Cannot remove set",
        description: "An exercise must have at least one set.",
        variant: "destructive",
      })
      return
    }

    updatedExercises[exerciseIndex].sets.splice(setIndex, 1)
    setActiveExercises(updatedExercises)

    toast({
      title: "Set removed",
      description: "The set has been removed from your exercise.",
    })
  }

  const handleFinishWorkout = () => {
    toast({
      title: "Workout completed",
      description: "Your workout has been saved successfully.",
    })
    setIsWorkoutStarted(false)
    setSelectedPlanId("")
    setActiveExercises([])
  }

  const getExerciseDetails = (id: string) => {
    return exercises.find((ex) => ex.id === id)
  }

  const getRepRange = (exerciseId: string) => {
    const plan = workoutPlans.find((p) => p.id === selectedPlanId)
    if (!plan) return ""

    const exercise = plan.exercises.find((e) => e.exerciseId === exerciseId)
    return exercise ? exercise.repRange : ""
  }

  const getAlternativeExercises = (exerciseId: string) => {
    const plan = workoutPlans.find((p) => p.id === selectedPlanId)
    if (!plan) return []

    const exercise = plan.exercises.find((e) => e.exerciseId === exerciseId)
    return exercise ? exercise.alternativeExerciseIds : []
  }

  // Calculate personal bests from workout data
  const calculatePersonalBests = () => {
    const personalBests = {}

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const maxWeightSet = exercise.sets.reduce((max, set) => (set.weight > max ? set.weight : max), 0)

        if (!personalBests[exercise.exerciseId] || maxWeightSet > personalBests[exercise.exerciseId]) {
          personalBests[exercise.exerciseId] = maxWeightSet
        }
      })
    })

    return personalBests
  }

  const getMaxWeightAndReps = (exerciseId: string) => {
    const personalBests = calculatePersonalBests()

    // Check personal bests first
    if (personalBests[exerciseId]) {
      // Find the workout that has this exercise to get the reps
      let maxReps = 0
      for (const workout of workouts) {
        const exerciseData = workout.exercises.find((e) => e.exerciseId === exerciseId)
        if (exerciseData) {
          // Find the set with the highest weight
          const maxWeightSet = exerciseData.sets.reduce(
            (max, set) => (set.weight === personalBests[exerciseId] && set.reps > max.reps ? set : max),
            { weight: 0, reps: 0 },
          )

          if (maxWeightSet.reps > maxReps) {
            maxReps = maxWeightSet.reps
          }
        }
      }

      return {
        weight: personalBests[exerciseId],
        reps: maxReps || "?", // If we can't find reps, show a question mark
      }
    }

    // If no personal best, look through workout history
    let maxWeight = 0
    let repsAtMaxWeight = 0

    for (const workout of workouts) {
      const exerciseData = workout.exercises.find((e) => e.exerciseId === exerciseId)
      if (exerciseData) {
        // Find the set with the highest weight
        const maxWeightSet = exerciseData.sets.reduce((max, set) => (set.weight > max.weight ? set : max), {
          weight: 0,
          reps: 0,
        })

        if (maxWeightSet.weight > maxWeight) {
          maxWeight = maxWeightSet.weight
          repsAtMaxWeight = maxWeightSet.reps
        }
      }
    }

    if (maxWeight === 0) {
      // If no history, use the default weight from exercise data
      const exerciseData = exercises.find((e) => e.id === exerciseId)
      return {
        weight: exerciseData?.lastWeight || 0,
        reps: 0,
      }
    }

    return {
      weight: maxWeight,
      reps: repsAtMaxWeight,
    }
  }

  const handleReplaceExercise = (index: number) => {
    setExerciseToReplace(index)
  }

  const confirmReplaceExercise = (newExerciseId: string) => {
    if (exerciseToReplace === null) return

    const updatedExercises = [...activeExercises]
    const originalExerciseId =
      updatedExercises[exerciseToReplace].originalExerciseId || updatedExercises[exerciseToReplace].exerciseId

    updatedExercises[exerciseToReplace] = {
      ...updatedExercises[exerciseToReplace],
      exerciseId: newExerciseId,
      originalExerciseId: originalExerciseId,
    }

    setActiveExercises(updatedExercises)
    setExerciseToReplace(null)

    toast({
      title: "Exercise replaced",
      description: `Exercise has been replaced with ${getExerciseDetails(newExerciseId)?.name}`,
    })
  }

  const handleAddNewExercise = (exerciseId: string, sets: number) => {
    const exerciseData = exercises.find((e) => e.id === exerciseId)
    const lastWeight = exerciseData?.lastWeight || 0

    const newExercise: ActiveExercise = {
      exerciseId,
      sets: Array(sets)
        .fill(0)
        .map(() => ({
          weight: lastWeight,
          reps: 0,
        })),
      earlyRPE: 7,
      lastRPE: 9,
      restTime: 90,
      warmupSets: 1,
    }

    setActiveExercises([...activeExercises, newExercise])
    setAddExerciseDialogOpen(false)

    toast({
      title: "Exercise added",
      description: `${exerciseData?.name} has been added to your workout`,
    })
  }

  const startRestTimer = (exerciseIndex: number) => {
    const restTime = activeExercises[exerciseIndex].restTime || 60
    setRestTimer({
      isActive: true,
      timeLeft: restTime,
      exerciseIndex,
    })
  }

  const pauseRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, isActive: false }))
  }

  const resumeRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, isActive: true }))
  }

  const resetRestTimer = () => {
    if (restTimer.exerciseIndex !== null) {
      const restTime = activeExercises[restTimer.exerciseIndex].restTime || 60
      setRestTimer({
        isActive: false,
        timeLeft: restTime,
        exerciseIndex: restTimer.exerciseIndex,
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Get the recommended reps from the rep range (e.g., "8-12" -> 10)
  const getRecommendedReps = (repRange: string) => {
    if (!repRange) return ""
    const parts = repRange.split("-")
    if (parts.length === 2) {
      const min = Number.parseInt(parts[0])
      const max = Number.parseInt(parts[1])
      if (!isNaN(min) && !isNaN(max)) {
        return Math.floor((min + max) / 2).toString()
      }
    }
    return repRange
  }

  const getLastWorkoutData = (exerciseId) => {
    // Find the most recent workout that includes this exercise
    const workoutsWithExercise = workouts
      .filter((workout) => workout.exercises.some((ex) => ex.exerciseId === exerciseId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (workoutsWithExercise.length === 0) {
      return null
    }

    const lastWorkout = workoutsWithExercise[0]
    const exerciseData = lastWorkout.exercises.find((ex) => ex.exerciseId === exerciseId)

    return {
      date: new Date(lastWorkout.date),
      sets: exerciseData.sets,
    }
  }

  if (!isWorkoutStarted) {
    return (
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Start Workout</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select a workout plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleSelectPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a workout plan" />
                </SelectTrigger>
                <SelectContent>
                  {workoutPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  const selectedPlan = workoutPlans.find((p) => p.id === selectedPlanId)

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{selectedPlan?.name}</h1>
          </div>
          <Dialog open={addExerciseDialogOpen} onOpenChange={setAddExerciseDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Exercise</DialogTitle>
                <DialogDescription>Add a new exercise to your current workout</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="exercise">Exercise</Label>
                  <Select onValueChange={(value) => handleAddNewExercise(value, 3)}>
                    <SelectTrigger id="exercise">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name} ({ex.muscleGroups.join(", ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddExerciseDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {restTimer.isActive && (
          <Card className="bg-orange-500/10 border-orange-500">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Rest Timer</span>
                  </div>
                  <span className="text-xl font-bold">{formatTime(restTimer.timeLeft)}</span>
                </div>
                <Progress
                  value={(restTimer.timeLeft / (activeExercises[restTimer.exerciseIndex!]?.restTime || 60)) * 100}
                  className="h-2"
                />
                <div className="flex justify-center gap-2">
                  {restTimer.isActive ? (
                    <Button variant="outline" size="sm" onClick={pauseRestTimer}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={resumeRestTimer}>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={resetRestTimer}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {activeExercises.map((exercise, exerciseIndex) => {
            const exerciseDetails = getExerciseDetails(exercise.exerciseId)
            const repRange = getRepRange(exercise.originalExerciseId || exercise.exerciseId)
            const alternativeExercises = exercise.originalExerciseId
              ? getAlternativeExercises(exercise.originalExerciseId)
              : getAlternativeExercises(exercise.exerciseId)
            const isSubstituted = exercise.originalExerciseId && exercise.originalExerciseId !== exercise.exerciseId
            const maxWeightAndReps = getMaxWeightAndReps(exercise.exerciseId)
            const recommendedReps = getRecommendedReps(repRange)

            return (
              <Card key={exerciseIndex}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {exerciseDetails?.name}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Exercise history</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Last Workout: {exerciseDetails?.name}</DialogTitle>
                              <DialogDescription>
                                Your performance from the last time you did this exercise
                              </DialogDescription>
                            </DialogHeader>
                            {(() => {
                              const lastData = getLastWorkoutData(exercise.exerciseId)
                              if (!lastData) {
                                return (
                                  <p className="text-center py-4 text-muted-foreground">No previous data available</p>
                                )
                              }

                              return (
                                <div className="space-y-4">
                                  <p className="text-sm text-muted-foreground">
                                    Date: {format(lastData.date, "MMMM d, yyyy")}
                                  </p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Set</TableHead>
                                        <TableHead>Weight (kg)</TableHead>
                                        <TableHead>Reps</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {lastData.sets.map((set, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell>{idx + 1}</TableCell>
                                          <TableCell>{set.weight}</TableCell>
                                          <TableCell>{set.reps}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )
                            })()}
                          </DialogContent>
                        </Dialog>
                        {isSubstituted && (
                          <Badge variant="outline" className="text-xs">
                            Substituted
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exerciseDetails?.muscleGroups.map((group) => (
                          <Badge key={group} variant="secondary" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Dialog
                      open={exerciseToReplace === exerciseIndex}
                      onOpenChange={(open) => !open && setExerciseToReplace(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => handleReplaceExercise(exerciseIndex)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span className="text-xs">Replace</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Replace Exercise</DialogTitle>
                          <DialogDescription>
                            Choose a different exercise to replace {exerciseDetails?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="space-y-4">
                            {isSubstituted && (
                              <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="font-medium">Original exercise:</p>
                                <p>{getExerciseDetails(exercise.originalExerciseId!)?.name}</p>
                              </div>
                            )}

                            {alternativeExercises.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Recommended Alternatives</Label>
                                <div className="grid gap-2">
                                  {alternativeExercises.map((altId) => (
                                    <Button
                                      key={altId}
                                      variant="outline"
                                      className="justify-start h-auto py-2"
                                      onClick={() => confirmReplaceExercise(altId)}
                                    >
                                      <div className="flex flex-col items-start">
                                        <span>{getExerciseDetails(altId)?.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {getExerciseDetails(altId)?.muscleGroups.join(", ")}
                                        </span>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Other Exercises</Label>
                              <Select onValueChange={confirmReplaceExercise}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select another exercise" />
                                </SelectTrigger>
                                <SelectContent>
                                  {exercises
                                    .filter(
                                      (ex) => ex.id !== exercise.exerciseId && !alternativeExercises.includes(ex.id),
                                    )
                                    .map((ex) => (
                                      <SelectItem key={ex.id} value={ex.id}>
                                        {ex.name} ({ex.muscleGroups.join(", ")})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setExerciseToReplace(null)}>
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                    {(exercise.earlyRPE || exercise.lastRPE) && (
                      <div className="flex items-center gap-1">
                        <span>
                          Target RPE: {exercise.earlyRPE}-{exercise.lastRPE}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0">
                                <Info className="h-3 w-3" />
                                <span className="sr-only">RPE info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Rate of Perceived Exertion (RPE) on a scale of 1-10. Start with {exercise.earlyRPE} RPE
                                and aim for {exercise.lastRPE} RPE on your final set.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {exercise.restTime && (
                      <div className="flex items-center gap-1">
                        <span>Rest: {formatTime(exercise.restTime)}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0">
                                <Info className="h-3 w-3" />
                                <span className="sr-only">Rest time info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Rest between sets. Click the timer button after completing a set.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {exercise.warmupSets !== undefined && exercise.warmupSets > 0 && (
                      <div className="flex items-center gap-1">
                        <span>Warmup sets: {exercise.warmupSets}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0">
                                <Info className="h-3 w-3" />
                                <span className="sr-only">Warmup sets info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Perform {exercise.warmupSets} warmup sets with lighter weights before your working sets.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {/* Add max weight and reps info */}
                    {maxWeightAndReps.weight > 0 && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-orange-500" />
                        <span>
                          Best: {maxWeightAndReps.weight} kg × {maxWeightAndReps.reps} reps
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0">
                                <Info className="h-3 w-3" />
                                <span className="sr-only">Personal best info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">Your personal best for this exercise.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2 text-sm font-medium">Set {setIndex + 1}</div>
                        <div className="col-span-5">
                          <Label htmlFor={`weight-${exerciseIndex}-${setIndex}`} className="sr-only">
                            Weight
                          </Label>
                          <div className="relative">
                            <Input
                              id={`weight-${exerciseIndex}-${setIndex}`}
                              type="number"
                              value={set.weight || ""}
                              onChange={(e) =>
                                handleSetChange(exerciseIndex, setIndex, "weight", Number(e.target.value))
                              }
                              className="pr-8"
                              placeholder={`${exerciseDetails?.lastWeight || 0}`}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                              kg
                            </div>
                          </div>
                        </div>
                        <div className="col-span-5">
                          <div className="flex gap-1">
                            <div className="flex-1">
                              <Label htmlFor={`reps-${exerciseIndex}-${setIndex}`} className="sr-only">
                                Reps
                              </Label>
                              <Input
                                id={`reps-${exerciseIndex}-${setIndex}`}
                                type="number"
                                value={set.reps || ""}
                                onChange={(e) =>
                                  handleSetChange(exerciseIndex, setIndex, "reps", Number(e.target.value))
                                }
                                placeholder={recommendedReps || repRange}
                              />
                            </div>
                            <div className="flex gap-1">
                              {exercise.restTime && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10"
                                  onClick={() => startRestTimer(exerciseIndex)}
                                >
                                  <Timer className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove set</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddSet(exerciseIndex)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Set
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <Separator />

        <Button className="w-full py-6 bg-orange-500 hover:bg-orange-600" onClick={handleFinishWorkout}>
          <Save className="mr-2 h-5 w-5" />
          Finish Workout
        </Button>
      </div>
    </AppShell>
  )
}
